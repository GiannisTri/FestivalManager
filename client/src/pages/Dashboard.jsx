import { useEffect, useState } from "react";

import vendorsService from "../services/vendorsService";
import registrationsService from "../services/registrationsService";
import festivalsService from "../services/festivalsService";
import paymentsService from "../services/paymentsService";

import "../css/Dashboard.css";

function Dashboard() {
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] =
    useState(currentYear);

  const [vendors, setVendors] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [payments, setPayments] = useState([]);

  const [now, setNow] = useState(new Date());

  // Εμφάνιση / απόκρυψη οικονομικών
  const [showFinancials, setShowFinancials] =
    useState(true);

  // =========================================
  // ΦΟΡΤΩΣΗ ΔΕΔΟΜΕΝΩΝ
  // =========================================

  useEffect(() => {
    async function loadData() {
      try {
        const [
          vendors,
          registrations,
          festivals,
          payments,
        ] = await Promise.all([
          vendorsService.getAllVendors(),
          registrationsService.getAllRegistrations(),
          festivalsService.getAllFestivals(),
          paymentsService.getAllPayments(),
        ]);

        setVendors(vendors);
        setRegistrations(registrations);
        setFestivals(festivals);
        setPayments(payments);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  // =========================================
  // LIVE COUNTDOWN
  // =========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // =========================================
  // REGISTRATIONS ΕΠΙΛΕΓΜΕΝΟΥ ΕΤΟΥΣ
  // =========================================

  const registrationsForSelectedYear =
    registrations.filter(
      (registration) =>
        registration.year === Number(selectedYear)
    );

  const registrationIdsForSelectedYear =
    registrationsForSelectedYear.map(
      (registration) => registration.id
    );

  // =========================================
  // ΗΜΕΡΟΜΗΝΙΑ
  // =========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // =========================================
  // ΕΝΕΡΓΟ ΠΑΝΗΓΥΡΙ
  // =========================================

  const activeFestival = festivals.find(
    (festival) =>
      today >= festival.startDate &&
      today <= festival.endDate
  );

  // =========================================
  // ΕΠΟΜΕΝΟ ΠΑΝΗΓΥΡΙ
  // =========================================

  const upcomingFestival = festivals
    .filter(
      (festival) =>
        festival.startDate > today
    )
    .sort((a, b) =>
      a.startDate.localeCompare(
        b.startDate
      )
    )[0];

  // =========================================
  // ΣΥΜΜΕΤΕΧΟΝΤΕΣ ΕΝΕΡΓΟΥ ΠΑΝΗΓΥΡΙΟΥ
  // =========================================

  const activeFestivalParticipants =
    activeFestival
      ? payments.filter(
          (payment) =>
            payment.festivalId ===
              activeFestival.id &&
            registrationIdsForSelectedYear.includes(
              payment.registrationId
            )
        ).length
      : 0;

  // =========================================
  // ΣΥΝΟΛΙΚΟ AMOUNT ΑΝΑ ΠΑΝΗΓΥΡΙ
  // =========================================

  const getFestivalTotal = (festivalId) => {
    return payments
      .filter(
        (payment) =>
          payment.festivalId === festivalId &&
          registrationIdsForSelectedYear.includes(
            payment.registrationId
          )
      )
      .reduce(
        (sum, payment) =>
          sum +
          Number(payment.amount || 0),
        0
      );
  };

  // =========================================
  // ΣΥΝΟΛΙΚΑ TAXES ΑΝΑ ΠΑΝΗΓΥΡΙ
  // =========================================

  const getFestivalTaxes = (festivalId) => {
    return payments
      .filter(
        (payment) =>
          payment.festivalId === festivalId &&
          registrationIdsForSelectedYear.includes(
            payment.registrationId
          )
      )
      .reduce(
        (sum, payment) =>
          sum +
          Number(payment.taxes || 0),
        0
      );
  };

  // =========================================
  // ΣΥΝΟΛΙΚΑ ΕΣΟΔΑ
  // =========================================

  const totalAmount = festivals.reduce(
    (sum, festival) =>
      sum +
      getFestivalTotal(festival.id),
    0
  );

  // =========================================
  // ΣΥΝΟΛΙΚΑ ΥΠΟΛΟΙΠΑ
  // =========================================

  const totalTaxes = festivals.reduce(
    (sum, festival) =>
      sum +
      getFestivalTaxes(festival.id),
    0
  );

  // =========================================
  // ΠΩΛΗΤΕΣ ΜΕ ΥΠΟΛΟΙΠΟ
  // =========================================

  const vendorsWithBalance =
    new Set(
      payments
        .filter(
          (payment) =>
            registrationIdsForSelectedYear.includes(
              payment.registrationId
            ) &&
            Number(payment.taxes || 0) > 0
        )
        .map((payment) => {
          const registration =
            registrations.find(
              (r) =>
                r.id ===
                payment.registrationId
            );

          return registration?.vendorId;
        })
        .filter(Boolean)
    ).size;

  // =========================================
  // COUNTDOWN
  // =========================================

  const getCountdown = (startDate) => {
    const start = new Date(startDate);

    const difference =
      start.getTime() -
      now.getTime();

    if (difference <= 0) {
      return null;
    }

    const totalSeconds =
      Math.floor(
        difference / 1000
      );

    const days =
      Math.floor(
        totalSeconds / 86400
      );

    const hours =
      Math.floor(
        (totalSeconds % 86400) /
        3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) /
        60
      );

    const seconds =
      totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  // =========================================
  // ΣΤΟΙΧΕΙΑ ΟΙΚΟΝΟΜΙΚΗΣ ΕΙΚΟΝΑΣ
  // =========================================

  const festivalTotals =
    festivals.map(
      (festival) => ({
        festival,

        total:
          getFestivalTotal(
            festival.id
          ),

        taxes:
          getFestivalTaxes(
            festival.id
          ),
      })
    );

  const maxFestivalTotal =
    Math.max(
      ...festivalTotals.map(
        (item) => item.total
      ),
      1
    );

  // =========================================
  // FORMAT ΧΡΗΜΑΤΩΝ
  // =========================================

  const formatMoney = (value) => {
    return value.toLocaleString(
      "el-GR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // =========================================
  // SMART INSIGHTS
  // =========================================

  const totalPossible =
    totalAmount + totalTaxes;

  const collectionPercentage =
    totalPossible > 0
      ? (totalAmount / totalPossible) *
        100
      : 0;

  // =========================================
  // ΚΑΛΥΤΕΡΟ ΠΑΝΗΓΥΡΙ ΣΕ ΕΣΟΔΑ
  // =========================================

  const topFestival =
    festivalTotals.length > 0
      ? [...festivalTotals]
          .sort(
            (a, b) =>
              b.total - a.total
          )[0]
      : null;

  // =========================================
  // ΠΑΝΗΓΥΡΙ ΜΕ ΠΕΡΙΣΣΟΤΕΡΟΥΣ ΠΩΛΗΤΕΣ
  // =========================================

  const festivalParticipants =
    festivals.map(
      (festival) => {
        const participantIds =
          new Set(
            payments
              .filter(
                (payment) =>
                  payment.festivalId ===
                    festival.id &&
                  registrationIdsForSelectedYear.includes(
                    payment.registrationId
                  )
              )
              .map((payment) => {
                const registration =
                  registrations.find(
                    (r) =>
                      r.id ===
                      payment.registrationId
                  );

                return registration?.vendorId;
              })
              .filter(Boolean)
          );

        return {
          festival,
          count:
            participantIds.size,
        };
      }
    );

  const mostPopularFestival =
    festivalParticipants.length > 0
      ? [...festivalParticipants]
          .sort(
            (a, b) =>
              b.count - a.count
          )[0]
      : null;

  // =========================================
  // ΠΩΛΗΤΗΣ ΜΕ ΤΑ ΠΕΡΙΣΣΟΤΕΡΑ ΕΣΟΔΑ
  // =========================================

  const vendorTotals =
    vendors.map(
      (vendor) => {

        const vendorRegistrationIds =
          registrations
            .filter(
              (registration) =>
                registration.vendorId ===
                  vendor.id &&
                registration.year ===
                  Number(selectedYear)
            )
            .map(
              (registration) =>
                registration.id
            );

        const total =
          payments
            .filter(
              (payment) =>
                vendorRegistrationIds.includes(
                  payment.registrationId
                )
            )
            .reduce(
              (sum, payment) =>
                sum +
                Number(
                  payment.amount || 0
                ),
              0
            );

        return {
          vendor,
          total,
        };
      }
    );

  const topVendor =
    vendorTotals.length > 0
      ? [...vendorTotals]
          .sort(
            (a, b) =>
              b.total - a.total
          )[0]
      : null;

  // =========================================
  // BALANCE STATUS
  // =========================================

  const balanceStatus =
    vendorsWithBalance > 0
      ? {
          type: "warning",
          icon: "⚠️",
          title:
            "Υπάρχουν εκκρεμή υπόλοιπα",
          text:
            `${vendorsWithBalance} πωλητές έχουν ` +
            `συνολικό υπόλοιπο ${formatMoney(
              totalTaxes
            )}€`,
        }
      : {
          type: "success",
          icon: "🎉",
          title:
            "Όλα τακτοποιημένα",
          text:
            `Δεν υπάρχουν εκκρεμή υπόλοιπα ` +
            `για το ${selectedYear}.`,
        };

  // =========================================
  // 🔔 AUTOMATIC ALERTS
  // =========================================

  const automaticAlerts = [];

  // -----------------------------------------
  // ΥΠΟΛΟΙΠΑ
  // -----------------------------------------

  if (vendorsWithBalance > 0) {
    automaticAlerts.push({
      type: "warning",
      icon: "⚠️",
      title:
        "Υπάρχουν εκκρεμή υπόλοιπα",
      text:
        `${vendorsWithBalance} πωλητές έχουν ` +
        `υπόλοιπο προς είσπραξη.`,
    });
  }

  // -----------------------------------------
  // ΕΝΕΡΓΟ ΠΑΝΗΓΥΡΙ
  // -----------------------------------------

  if (activeFestival) {
    automaticAlerts.push({
      type: "success",
      icon: "🟢",
      title:
        "Ενεργό πανηγύρι",
      text:
        `${activeFestival.name} βρίσκεται ` +
        `αυτή τη στιγμή σε εξέλιξη.`,
    });
  }

  // -----------------------------------------
  // ΕΠΟΜΕΝΟ ΠΑΝΗΓΥΡΙ
  // -----------------------------------------

  if (upcomingFestival) {

    const start =
      new Date(
        upcomingFestival.startDate
      );

    const todayDate =
      new Date();

    const difference =
      start.getTime() -
      todayDate.getTime();

    const daysLeft =
      Math.ceil(
        difference /
          (1000 * 60 * 60 * 24)
      );

    if (daysLeft <= 7) {

      automaticAlerts.push({
        type: "danger",
        icon: "🚨",
        title:
          "Το επόμενο πανηγύρι πλησιάζει",
        text:
          `${upcomingFestival.name} ξεκινά ` +
          `σε ${daysLeft} ${
            daysLeft === 1
              ? "ημέρα"
              : "ημέρες"
          }.`,
      });

    }
  }

  // -----------------------------------------
  // ΚΑΛΥΤΕΡΟ ΠΑΝΗΓΥΡΙ
  // -----------------------------------------

  if (
    topFestival &&
    topFestival.total > 0
  ) {
    automaticAlerts.push({
      type: "info",
      icon: "💰",
      title:
        "Καλύτερη επίδοση",
      text:
        `${topFestival.festival.name} έχει ` +
        `τα υψηλότερα έσοδα για το ` +
        `${selectedYear}.`,
    });
  }

  // -----------------------------------------
  // ΚΑΝΕΝΑ ALERT
  // -----------------------------------------

  if (
    automaticAlerts.length === 0
  ) {
    automaticAlerts.push({
      type: "success",
      icon: "🎉",
      title:
        "Όλα υπό έλεγχο",
      text:
        `Δεν υπάρχουν σημαντικές ` +
        `εκκρεμότητες για το ${selectedYear}.`,
    });
  }

  return (
    <div className="dashboard">

      <h1>
        Dashboard
      </h1>

      {/* =========================================
          BASIC STATISTICS
      ========================================= */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="icon">
            👥
          </div>

          <h2>
            {vendors.length}
          </h2>

          <p>
            Συνολικοί Πωλητές
          </p>

        </div>


        <div className="stat-card">

          <div className="icon">
            📝
          </div>

          <h2>
            {
              registrationsForSelectedYear.length
            }
          </h2>

          <p>
            Εγγραφές {selectedYear}
          </p>

        </div>


        <div className="stat-card">

          <div className="icon">
            🎪
          </div>

          <h2>
            {festivals.length}
          </h2>

          <p>
            Πανηγύρια
          </p>

        </div>

      </div>


      {/* =========================================
          ACTIVE / NEXT FESTIVAL
      ========================================= */}

      <div className="festival-grid">

        <div className="festival-card">

          <h2>
            🟢 Ενεργό Πανηγύρι
          </h2>

          {activeFestival ? (
            <>
              <h3>
                {activeFestival.name}
              </h3>

              <p>
                {activeFestival.startDate}
                {" - "}
                {activeFestival.endDate}
              </p>

              <p>
                Συμμετέχοντες:{" "}
                {
                  activeFestivalParticipants
                }
              </p>

              <span className="badge active">
                Σε εξέλιξη
              </span>
            </>
          ) : (
            <>
              <h3>
                Δεν υπάρχει ενεργό
                πανηγύρι
              </h3>

              <span className="badge inactive">
                Εκτός περιόδου
              </span>
            </>
          )}

        </div>


        <div className="festival-card">

          <h2>
            ⏳ Επόμενο Πανηγύρι
          </h2>

          {upcomingFestival ? (
            <>
              <h3>
                {upcomingFestival.name}
              </h3>

              <p>
                {upcomingFestival.startDate}
                {" - "}
                {upcomingFestival.endDate}
              </p>
            </>
          ) : (
            <h3>
              Δεν υπάρχουν επόμενα
              πανηγύρια
            </h3>
          )}

        </div>

      </div>


      {/* =========================================
          ΣΥΝΟΛΑ ΠΑΝΗΓΥΡΙΩΝ
      ========================================= */}

      <div className="festival-totals-section">

        <div className="festival-totals-header">

          <h2>
            💰 Σύνολα Πανηγυριών
          </h2>

          <div className="year-selector">

            <label htmlFor="dashboard-year">
              Έτος:
            </label>

            <select
              id="dashboard-year"
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  Number(
                    e.target.value
                  )
                )
              }
            >

              <option value="2025">
                2025
              </option>

              <option value="2026">
                2026
              </option>

              <option value="2027">
                2027
              </option>

              <option value="2028">
                2028
              </option>

            </select>

          </div>

        </div>


        <div className="festival-totals-grid">

          {festivals.map(
            (festival) => {

              const total =
                getFestivalTotal(
                  festival.id
                );

              const countdown =
                getCountdown(
                  festival.startDate
                );

              return (
                <div
                  key={festival.id}
                  className="festival-total-card"
                >

                  <div className="festival-total-icon">
                    🎪
                  </div>

                  <h3>
                    {festival.name}
                  </h3>

                  <div
                    className={
                      `festival-total-amount ${
                        !showFinancials
                          ? "financial-blurred"
                          : ""
                      }`
                    }
                  >
                    {formatMoney(
                      total
                    )}
                    €
                  </div>

                  <p>
                    Συνολικό ποσό{" "}
                    {selectedYear}
                  </p>


                  {countdown ? (

                    <div className="festival-countdown">

                      <span>
                        ⏳ Έναρξη σε
                      </span>

                      <strong>

                        {countdown.days}η{" "}

                        {String(
                          countdown.hours
                        ).padStart(
                          2,
                          "0"
                        )}

                        :

                        {String(
                          countdown.minutes
                        ).padStart(
                          2,
                          "0"
                        )}

                        :

                        {String(
                          countdown.seconds
                        ).padStart(
                          2,
                          "0"
                        )}

                      </strong>

                    </div>

                  ) : (

                    <div className="festival-countdown started">
                      🟢 Σε εξέλιξη
                    </div>

                  )}

                </div>
              );

            }
          )}

        </div>

      </div>


      {/* =========================================
          ΟΙΚΟΝΟΜΙΚΗ ΕΙΚΟΝΑ
      ========================================= */}

      <div className="financial-section">

        <div className="financial-header">

          <div>

            <h2>
              📊 Οικονομική Εικόνα
            </h2>

            <p>
              Αναλυτικά στοιχεία για το{" "}
              {selectedYear}
            </p>

          </div>

          <button
            type="button"
            className="financial-visibility-btn"
            onClick={() =>
              setShowFinancials(
                (prev) => !prev
              )
            }
            aria-label={
              showFinancials
                ? "Απόκρυψη οικονομικών στοιχείων"
                : "Εμφάνιση οικονομικών στοιχείων"
            }
            title={
              showFinancials
                ? "Απόκρυψη ποσών"
                : "Εμφάνιση ποσών"
            }
          >
            {showFinancials
              ? "🔒"
              : "👁️"}
          </button>

        </div>


        {/* SUMMARY CARDS */}

        <div className="financial-summary">

          <div className="financial-summary-card income">

            <div className="financial-summary-icon">
              💰
            </div>

            <div>

              <span>
                Συνολικά Έσοδα
              </span>

              <strong
                className={
                  !showFinancials
                    ? "financial-blurred"
                    : ""
                }
              >
                {formatMoney(
                  totalAmount
                )} €
              </strong>

            </div>

          </div>


          <div className="financial-summary-card balance">

            <div className="financial-summary-icon">
              ⚠️
            </div>

            <div>

              <span>
                Υπόλοιπα προς είσπραξη
              </span>

              <strong
                className={
                  !showFinancials
                    ? "financial-blurred"
                    : ""
                }
              >
                {formatMoney(
                  totalTaxes
                )} €
              </strong>

            </div>

          </div>


          <div className="financial-summary-card vendors-balance">

            <div className="financial-summary-icon">
              👥
            </div>

            <div>

              <span>
                Πωλητές με υπόλοιπο
              </span>

              <strong>
                {vendorsWithBalance}
              </strong>

            </div>

          </div>

        </div>


        {/* ΓΡΑΦΗΜΑ ΑΝΑ ΠΑΝΗΓΥΡΙ */}

        <div className="financial-chart-card">

          <div className="financial-chart-header">

            <h3>
              Έσοδα ανά Πανηγύρι
            </h3>

            <span>
              {selectedYear}
            </span>

          </div>


          <div className="financial-chart">

            {festivalTotals.map(
              ({
                festival,
                total,
              }) => {

                const percentage =
                  (total /
                    maxFestivalTotal) *
                  100;

                return (

                  <div
                    key={festival.id}
                    className="chart-row"
                  >

                    <div className="chart-label">

                      <span>
                        {festival.name}
                      </span>

                      <strong
                        className={
                          !showFinancials
                            ? "financial-blurred"
                            : ""
                        }
                      >
                        {formatMoney(
                          total
                        )} €
                      </strong>

                    </div>


                    <div className="chart-bar-background">

                      <div
                        className="chart-bar"
                        style={{
                          width:
                            showFinancials
                              ? `${percentage}%`
                              : "100%",
                        }}
                      />

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>


        {/* ΥΠΟΛΟΙΠΑ ΑΝΑ ΠΑΝΗΓΥΡΙ */}

        <div className="balances-card">

          <div className="balances-header">

            <h3>
              💳 Υπόλοιπα ανά Πανηγύρι
            </h3>

            <span>
              {selectedYear}
            </span>

          </div>


          <div className="balances-list">

            {festivalTotals.map(
              ({
                festival,
                taxes,
              }) => (

                <div
                  key={festival.id}
                  className="balance-row"
                >

                  <div className="balance-festival">

                    <span className="balance-icon">
                      🎪
                    </span>

                    <span>
                      {festival.name}
                    </span>

                  </div>


                  <strong
                    className={
                      !showFinancials
                        ? "financial-blurred"
                        : ""
                    }
                  >
                    {formatMoney(
                      taxes
                    )} €
                  </strong>

                </div>

              )
            )}

          </div>

        </div>

      </div>


      {/* =========================================
          💡 SMART INSIGHTS
      ========================================= */}

      <div className="smart-insights-section">

        <div className="smart-insights-header">

          <div>

            <h2>
              💡 Smart Insights
            </h2>

            <p>
              Αυτόματη ανάλυση των δεδομένων
              για το {selectedYear}
            </p>

          </div>

          <div className="smart-insights-badge">
            ✨ Smart
          </div>

        </div>


        <div className="smart-insights-grid">

          {/* TOP FESTIVAL */}

          <div className="smart-insight-card top">

            <div className="smart-insight-icon">
              🏆
            </div>

            <div className="smart-insight-content">

              <span className="smart-insight-label">
                Καλύτερο Πανηγύρι
              </span>

              {topFestival ? (
                <>
                  <h3>
                    {
                      topFestival
                        .festival
                        .name
                    }
                  </h3>

                  <p>
                    Έχει τα υψηλότερα έσοδα
                    με{" "}
                    <strong
                      className={
                        !showFinancials
                          ? "financial-blurred"
                          : ""
                      }
                    >
                      {formatMoney(
                        topFestival.total
                      )}€
                    </strong>
                  </p>
                </>
              ) : (
                <p>
                  Δεν υπάρχουν δεδομένα.
                </p>
              )}

            </div>

          </div>


          {/* COLLECTION RATE */}

          <div className="smart-insight-card success">

            <div className="smart-insight-icon">
              📈
            </div>

            <div className="smart-insight-content">

              <span className="smart-insight-label">
                Ποσοστό Είσπραξης
              </span>

              <h3>
                {collectionPercentage.toFixed(
                  1
                )}%
              </h3>

              <div className="smart-progress">

                <div
                  className="smart-progress-bar"
                  style={{
                    width: `${Math.min(
                      collectionPercentage,
                      100
                    )}%`,
                  }}
                />

              </div>

              <p>
                Από το συνολικό ποσό
              </p>

            </div>

          </div>


          {/* BALANCES */}

          <div
            className={
              `smart-insight-card ${
                balanceStatus.type
              }`
            }
          >

            <div className="smart-insight-icon">
              {balanceStatus.icon}
            </div>

            <div className="smart-insight-content">

              <span className="smart-insight-label">
                Οικονομική Κατάσταση
              </span>

              <h3>
                {balanceStatus.title}
              </h3>

              <p>
                {balanceStatus.text}
              </p>

            </div>

          </div>


          {/* MOST POPULAR FESTIVAL */}

          <div className="smart-insight-card popular">

            <div className="smart-insight-icon">
              👥
            </div>

            <div className="smart-insight-content">

              <span className="smart-insight-label">
                Δημοφιλέστερο Πανηγύρι
              </span>

              {mostPopularFestival ? (
                <>
                  <h3>
                    {
                      mostPopularFestival
                        .festival
                        .name
                    }
                  </h3>

                  <p>
                    {
                      mostPopularFestival.count
                    } πωλητές συμμετέχουν
                  </p>
                </>
              ) : (
                <p>
                  Δεν υπάρχουν δεδομένα.
                </p>
              )}

            </div>

          </div>


          {/* TOP VENDOR */}

          <div className="smart-insight-card vendor">

            <div className="smart-insight-icon">
              ⭐
            </div>

            <div className="smart-insight-content">

              <span className="smart-insight-label">
                Κορυφαίος Πωλητής
              </span>

              {topVendor ? (
                <>
                  <h3>
                    {
                      topVendor.vendor
                        .firstName
                    }{" "}
                    {
                      topVendor.vendor
                        .lastName
                    }
                  </h3>

                  <p>
                    Συνολικό ποσό:{" "}
                    <strong
                      className={
                        !showFinancials
                          ? "financial-blurred"
                          : ""
                      }
                    >
                      {formatMoney(
                        topVendor.total
                      )}€
                    </strong>
                  </p>
                </>
              ) : (
                <p>
                  Δεν υπάρχουν δεδομένα.
                </p>
              )}

            </div>

          </div>


          {/* ACTIVE FESTIVAL */}

          <div className="smart-insight-card live">

            <div className="smart-insight-icon">
              🔥
            </div>

            <div className="smart-insight-content">

              <span className="smart-insight-label">
                Κατάσταση
              </span>

              {activeFestival ? (
                <>
                  <h3>
                    🟢 LIVE
                  </h3>

                  <p>
                    {activeFestival.name}
                    {" — "}
                    {
                      activeFestivalParticipants
                    }{" "}
                    συμμετέχοντες
                  </p>
                </>
              ) : (
                <>
                  <h3>
                    🟡 Αναμονή
                  </h3>

                  <p>
                    Δεν υπάρχει ενεργό
                    πανηγύρι αυτή τη στιγμή.
                  </p>
                </>
              )}

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          🔔 AUTOMATIC ALERTS
      ========================================= */}

      <div className="automatic-alerts-section">

        <div className="automatic-alerts-header">

          <div>

            <h2>
              🔔 Automatic Alerts
            </h2>

            <p>
              Αυτόματες ειδοποιήσεις για το{" "}
              {selectedYear}
            </p>

          </div>

          <div className="alerts-live-badge">
            ● LIVE
          </div>

        </div>


        <div className="automatic-alerts-grid">

          {automaticAlerts.map(
            (alert, index) => (

              <div
                key={index}
                className={
                  `automatic-alert ${alert.type}`
                }
              >

                <div className="automatic-alert-icon">
                  {alert.icon}
                </div>

                <div className="automatic-alert-content">

                  <h3>
                    {alert.title}
                  </h3>

                  <p>
                    {alert.text}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
