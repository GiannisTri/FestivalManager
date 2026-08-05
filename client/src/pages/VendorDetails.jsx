import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import vendorsService from "../services/vendorsService";
import paymentsService from "../services/paymentsService";
import festivalsService from "../services/festivalsService";
import registrationsService from "../services/registrationsService";

function VendorDetails() {
  const { id } = useParams();

  const [vendor, setVendor] = useState(null);
  const [payments, setPayments] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          vendor,
          registrations,
          payments,
          festivals,
        ] = await Promise.all([
          vendorsService.getVendorById(id),
          registrationsService.getAllRegistrations(),
          paymentsService.getAllPayments(),
          festivalsService.getAllFestivals(),
        ]);

        setVendor(vendor);
        setRegistrations(registrations);
        setPayments(payments);
        setFestivals(festivals);

      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, [id]);

  if (!vendor) {
    return <h2>Φόρτωση...</h2>;
  }

  const vendorRegistrations = registrations.filter(
    (r) => r.vendorId === vendor.id
  );

  const years = vendorRegistrations
    .map((r) => r.year)
    .sort((a, b) => b - a);

  return (
    <div className="page">
      <div className="vendor-header">
        <h1>
          {vendor.firstName} {vendor.lastName}
        </h1>

        <p>📞 {vendor.phone}</p>

        <p>✉ {vendor.email}</p>
        <p>🪪 ΑΦΜ: {vendor.afm || "-"}</p>

{vendor.notes && (
  <div
    style={{
      marginTop: "20px",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      background: "#f8f8f8",
    }}
  >
    <strong>📝 Παρατηρήσεις</strong>

    <p
      style={{
        marginTop: "10px",
        whiteSpace: "pre-wrap",
      }}
    >
      {vendor.notes}
    </p>
  </div>
)}
      </div>

      {years.map((year) => {
        const registration = vendorRegistrations.find(
          (r) => r.year === year
        );

        const currentPayments = payments.filter(
          (p) => p.registrationId === registration.id
        );

        const total = currentPayments.reduce(
          (sum, p) => sum + Number(p.amount),
          0
        );

        return (
          <div
            key={year}
            className="year-card"
          >
            <div className="year-title">
              <h2>{year}</h2>

              <h3>Σύνολο: {total}€</h3>
            </div>

            <table className="vendors-table">
              <thead>
                <tr>
                  <th>Πανηγύρι</th>
                  <th>Θέση</th>
                  <th>Μέτρα</th>
                  <th>Ποσό</th>
                </tr>
              </thead>

              <tbody>
                {currentPayments.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      Δεν υπάρχουν συμμετοχές.
                    </td>
                  </tr>
                ) : (
                  currentPayments.map((payment) => {
                    const festival = festivals.find(
                      (f) => f.id === payment.festivalId
                    );

                    return (
                      <tr key={payment.id}>
                        <td>{festival?.name || "-"}</td>
                        <td>{payment.position || "-"}</td>
                        <td>{payment.meters || "-"}</td>
                        <td>{payment.amount}€</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default VendorDetails;
