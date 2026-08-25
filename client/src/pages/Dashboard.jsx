import { useEffect, useState } from "react";

import vendorsService from "../services/vendorsService";
import registrationsService from "../services/registrationsService";
import festivalsService from "../services/festivalsService";
import paymentsService from "../services/paymentsService";

import "../css/Dashboard.css";

function Dashboard() {
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [vendors, setVendors] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [payments, setPayments] = useState([]);

  const [now, setNow] = useState(new Date());

  // =========================================
  // Φόρτωση δεδομένων
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
  // Live countdown
  // =========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // =========================================
  // Registrations επιλεγμένου έτους
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
  // Ημερομηνίες
  // =========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // =========================================
  // Ενεργό πανηγύρι
  // =========================================

  const activeFestival = festivals.find(
    (festival) =>
      today >= festival.startDate &&
      today <= festival.endDate
  );

  // =========================================
  // Επόμενο πανηγύρι
  // =========================================

  const upcomingFestival = festivals
    .filter(
      (festival) =>
        festival.startDate > today
    )
    .sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    )[0];

  // =========================================
  // Συμμετέχοντες ενεργού πανηγυριού
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
  // Συνολικό AMOUNT ανά πανηγύρι
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
          sum + Number(payment.amount || 0),
        0
      );
  };

  // =========================================
  // Συνολικό TAXES ανά πανηγύρι
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
          sum + Number(payment.taxes || 0),
        0
      );
  };

  // =========================================
  // Συνολικά AMOUNT
  // =========================================

  const totalAmount = festivals.reduce(
    (sum, festival) =>
      sum + getFestivalTotal(festival.id),
    0
  );

  // =========================================
  // Συνολικά ΥΠΟΛΟΙΠΑ
  // =========================================

  const totalTaxes = festivals.reduce(
    (sum, festival) =>
      sum + getFestivalTaxes(festival.id),
    0
  );

  // =========================================
  // Πωλητές με υπόλοιπο
  // =========================================

  const vendorsWithBalance = new Set(
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
              r.id === payment.registrationId
          );

        return registration?.vendorId;
      })
      .filter(Boolean)
  ).size;

  // =========================================
  // Countdown
  // =========================================

  const getCountdown = (startDate) => {
    const start = new Date(startDate);

    const difference =
      start.getTime() - now.getTime();

    if (difference <= 0) {
      return null;
    }

    const totalSeconds = Math.floor(
      difference / 1000
    );

    const days = Math.floor(
      totalSeconds / 86400
    );

    const hours = Math.floor(
      (totalSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
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
  // Μεγαλύτερο ποσό για το γράφημα
  // =========================================

  const festivalTotals = festivals.map(
    (festival) => ({
      festival,
      total: getFestivalTotal(
        festival.id
      ),
      taxes: getFestivalTaxes(
        festival.id
      ),
    })
  );

  const maxFestivalTotal = Math.max(
    ...festivalTotals.map(
      (item) => item.total
    ),
    1
  );

  return (
    <div className="dashboard">

      <h1>Dashboard</h1>

      {/* =========================================
          BASIC STATISTICS
      ========================================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="icon">👥</div>

          <h2>
            {vendors.length}
          </h2>

          <p>
            Συνολικοί Πωλητές
          </p>
        </div>

        <div className="stat-card">
          <div className="icon">📝</div>

          <h2>
            {registrationsForSelectedYear.length}
          </h2>

          <p>
            Εγγραφές {selectedYear}
          </p>
        </div>

        <div className="stat-card">
          <div className="icon">🎪</div>

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
                {activeFestival.startDate} -{" "}
                {activeFestival.endDate}
              </p>

              <p>
                Συμμετέχοντες:{" "}
                {activeFestivalParticipants}
              </p>

              <span className="badge active">
                Σε εξέλιξη
              </span>
            </>
          ) : (
            <>
              <h3>
                Δεν υπάρχει ενεργό πανηγύρι
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
                {upcomingFestival.startDate} -{" "}
                {upcomingFestival.endDate}
              </p>
            </>
          ) : (
            <h3>
              Δεν υπάρχουν επόμενα πανηγύρια
            </h3>
          )}

        </div>

      </div>


      {/* =========================================
          FESTIVAL TOTALS
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
                  Number(e.target.value)
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

          {festivals.map((festival) => {

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

                <div className="festival-total-amount">
                  {total.toLocaleString(
                    "el-GR",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                  €
                </div>

                <p>
                  Συνολικό ποσό {selectedYear}
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
                      ).padStart(2, "0")}
                      :
                      {String(
                        countdown.minutes
                      ).padStart(2, "0")}
                      :
                      {String(
                        countdown.seconds
                      ).padStart(2, "0")}
                    </strong>

                  </div>
                ) : (
                  <div className="festival-countdown started">
                    🟢 Σε εξέλιξη
                  </div>
                )}

              </div>
            );

          })}

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
              Αναλυτικά στοιχεία για το {selectedYear}
            </p>
          </div>

        </div>


        <div className="financial-summary">

          <div className="financial-summary-card income">

            <div className="financial-summary-icon">
              💰
            </div>

            <div>
              <span>
                Συνολικά Έσοδα
              </span>

              <strong>
                {totalAmount.toLocaleString(
                  "el-GR",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
                €
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

              <strong>
                {totalTaxes.toLocaleString(
                  "el-GR",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
                €
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


        {/* =========================================
            ΓΡΑΦΗΜΑ ΑΝΑ ΠΑΝΗΓΥΡΙ
        ========================================= */}

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

                      <strong>
                        {total.toLocaleString(
                          "el-GR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                        €
                      </strong>
                    </div>


                    <div className="chart-bar-background">

                      <div
                        className="chart-bar"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>


        {/* =========================================
            ΥΠΟΛΟΙΠΑ ΑΝΑ ΠΑΝΗΓΥΡΙ
        ========================================= */}

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

                  <strong>
                    {taxes.toLocaleString(
                      "el-GR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                    €
                  </strong>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
