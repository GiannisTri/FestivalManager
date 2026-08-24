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

  // Registrations του επιλεγμένου έτους
  const registrationsForSelectedYear = registrations.filter(
    (registration) =>
      registration.year === Number(selectedYear)
  );

  // IDs των registrations του επιλεγμένου έτους
  const registrationIdsForSelectedYear =
    registrationsForSelectedYear.map(
      (registration) => registration.id
    );

  const today = new Date().toISOString().split("T")[0];

  const activeFestival = festivals.find(
    (festival) =>
      today >= festival.startDate &&
      today <= festival.endDate
  );

  const upcomingFestival = festivals
    .filter((festival) => festival.startDate > today)
    .sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    )[0];

  // Συμμετέχοντες ΜΟΝΟ του τρέχοντος έτους
  const activeFestivalParticipants = activeFestival
    ? payments.filter(
        (payment) =>
          payment.festivalId === activeFestival.id &&
          registrationIdsForSelectedYear.includes(
            payment.registrationId
          )
      ).length
    : 0;

  // Συνολικό amount ανά πανηγύρι
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

  return (
    <div className="dashboard">

      <h1>Dashboard</h1>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="icon">👥</div>
          <h2>{vendors.length}</h2>
          <p>Συνολικοί Πωλητές</p>
        </div>

        <div className="stat-card">
          <div className="icon">📝</div>
          <h2>{registrationsForSelectedYear.length}</h2>
          <p>Εγγραφές {selectedYear}</p>
        </div>

        <div className="stat-card">
          <div className="icon">🎪</div>
          <h2>{festivals.length}</h2>
          <p>Πανηγύρια</p>
        </div>

      </div>


      <div className="festival-grid">

        <div className="festival-card">

          <h2>🟢 Ενεργό Πανηγύρι</h2>

          {activeFestival ? (
            <>
              <h3>{activeFestival.name}</h3>

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

          <h2>⏳ Επόμενο Πανηγύρι</h2>

          {upcomingFestival ? (
            <>
              <h3>{upcomingFestival.name}</h3>

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
          ΣΥΝΟΛΑ ΠΑΝΗΓΥΡΙΩΝ
      ========================================= */}

      <div className="festival-totals-section">

        <div className="festival-totals-header">

          <h2>💰 Σύνολα Πανηγυριών</h2>

          <div className="year-selector">

            <label htmlFor="dashboard-year">
              Έτος:
            </label>

            <select
              id="dashboard-year"
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(Number(e.target.value))
              }
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>

          </div>

        </div>


        <div className="festival-totals-grid">

          {festivals.map((festival) => {

            const total = getFestivalTotal(
              festival.id
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
                  {total.toLocaleString("el-GR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  €
                </div>

                <p>
                  Συνολικό ποσό {selectedYear}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
