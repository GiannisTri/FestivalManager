import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import VendorModal from "../components/VendorModal";



import vendorsService from "../services/vendorsService";
import festivalsService from "../services/festivalsService";
import registrationsService from "../services/registrationsService";
import paymentsService from "../services/paymentsService";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [payments, setPayments] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [registrations, setRegistrations] = useState([]);

 async function loadInitialData() {
  try {
    const [
      vendors,
      registrations,
      payments,
      festivals,
    ] = await Promise.all([
      vendorsService.getAllVendors(),
      registrationsService.getAllRegistrations(),
      paymentsService.getAllPayments(),
      festivalsService.getAllFestivals(),
    ]);
    console.log({
  vendors,
  registrations,
  payments,
  festivals,
});

    setVendors(vendors);
    setRegistrations(registrations);
    setPayments(payments);
    setFestivals(festivals);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

useEffect(() => {
  loadInitialData();
}, []);

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2026");

  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const [message, setMessage] = useState("");

 async function deleteVendor(id) {
  if (!window.confirm("Θέλεις να διαγράψεις τον πωλητή;")) {
    return;
  }

  try {
    await vendorsService.deleteVendor(id);

    await loadInitialData();

    setMessage("✅ Ο πωλητής διαγράφηκε επιτυχώς.");

    setTimeout(() => {
      setMessage("");
    }, 3000);

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Σφάλμα κατά τη διαγραφή."
    );
  }
}

  function getCurrentFestival() {
         const today = new Date();

         const currentDate = today.toISOString().split("T")[0];

        return festivals.find(
           (festival) =>
           currentDate >= festival.startDate &&
           currentDate <= festival.endDate
        );
      }

const currentFestival = getCurrentFestival();
console.log("Festivals:", festivals);

  const filtered = vendors.filter((vendor) => {
    const fullName =
      `${vendor.firstName} ${vendor.lastName}`.toLowerCase();

      

    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      vendor.phone.includes(search) ||
      vendor.email.toLowerCase().includes(search.toLowerCase());

const vendorRegistrations = registrations.filter(
  (registration) => registration.vendorId === vendor.id
);

const matchesYear =
  year === "Όλα" ||
  vendorRegistrations.some(
    (registration) =>
      registration.year.toString() === year
  );

    return matchesSearch && matchesYear;
  });

  return (
    <div className="page">
      <h1>Πωλητές</h1>

      <div className="vendors-toolbar">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Αναζήτηση..."
        />

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option>2026</option>
          <option>2025</option>
          <option>Όλα</option>
        </select>

        <button
          className="add-btn"
          onClick={() => {
            setEditingVendor(null);
            setShowModal(true);
          }}
        >
          + Νέος Πωλητής
        </button>
      </div>

      {message && (
      <div className="success-message">
          {message}
      </div>
        )}

      <table className="vendors-table">
        <thead>
          <tr>
            <th>Πωλητής</th>
            <th>Τηλέφωνο</th>
            <th>Email</th>
            <th>Πανηγύρια</th>
            <th>Θέση Σήμερα</th>
            <th>Σύνολο</th>
            <th>Ενέργειες</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((vendor) => {
            const vendorRegistrations = registrations.filter(
               (registration) =>
                registration.vendorId === vendor.id &&
               (year === "Όλα" ||
               registration.year.toString() === year)
              );

            const registrationIds = vendorRegistrations.map(
                (registration) => registration.id
            );

            const vendorPayments = payments.filter((payment) =>
               registrationIds.includes(payment.registrationId)
             );

            const total = vendorPayments.reduce(
              (sum, payment) => sum + Number(payment.amount),
              0
            );

            const festivalIds = [
              ...new Set(
                vendorPayments.map(
                  (payment) => payment.festivalId
                )
              ),
            ];
            const currentPayment = currentFestival
               ? vendorPayments.find(
                 (payment) =>
                 payment.festivalId === currentFestival.id
              )
               : null;

            return (
              <tr key={vendor.id}>
                <td>
                  {vendor.firstName} {vendor.lastName}
                </td>

                <td>{vendor.phone}</td>

                <td>{vendor.email}</td>

                <td>
                  {festivalIds.length === 0 ? (
                    "-"
                  ) : (
                    festivalIds.map((festivalId) => {
                      const festival = festivals.find(
                        (f) => f.id === festivalId
                      );

                      return (
                        <span
                          key={festivalId}
                          className="festival-badge"
                        >
                          {festival?.name}
                        </span>
                      );
                    })
                  )}
                </td>

                <td>
                    {currentFestival
                      ? currentPayment
                      ? currentPayment.position
                        : "Δεν συμμετέχει"
                        : "-"}
                </td>

                <td>{total}€</td>

                <td className="actions">
                  <Link to={`/vendor/${vendor.id}`}>
                    👁
                  </Link>

                  <button
                    onClick={() => {
                      setEditingVendor(vendor);
                      setShowModal(true);
                    }}
                  >
                    ✏
                  </button>

                  <button
                    onClick={() =>
                      deleteVendor(vendor.id)
                    }
                  >
                    🗑
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <VendorModal
          key={editingVendor?.id ?? "new"}
          isOpen={showModal}
          vendor={editingVendor}
          festivals={festivals}
          payments={payments}
          registrations={registrations}
          onClose={() => {
             setEditingVendor(null);
             setShowModal(false);
          }}
        onSave={async (data) => {
  try {

    let savedVendor;

    if (editingVendor) {

  savedVendor = await vendorsService.updateVendor(
    editingVendor.id,
    data.vendor
  );

  let registration = registrations.find(
    (r) =>
      r.vendorId === editingVendor.id &&
      r.year === data.year
  );

  if (registration) {

    await registrationsService.updateRegistration(
      registration.id,
      {
        vendorId: editingVendor.id,
        year: data.year,
      }
    );

  } else {

    registration =
      await registrationsService.createRegistration({
        vendorId: editingVendor.id,
        year: data.year,
      });

  }

  const existingPayments = payments.filter(
    (p) => p.registrationId === registration.id
  );

  for (const festival of data.festivals) {

    if (festival.paymentId) {

      await paymentsService.updatePayment(
        festival.paymentId,
        {
          registrationId: registration.id,
          festivalId: festival.festivalId,
          position: festival.position,
          meters: festival.meters,
          amount: festival.amount,
        }
      );

    } else {

      await paymentsService.createPayment({
        registrationId: registration.id,
        festivalId: festival.festivalId,
        position: festival.position,
        meters: festival.meters,
        amount: festival.amount,
      });

    }

  }

  for (const payment of existingPayments) {

    const stillExists = data.festivals.some(
      (f) => f.paymentId === payment.id
    );

    if (!stillExists) {
      await paymentsService.deletePayment(payment.id);
    }

  }

} else {

      savedVendor = await vendorsService.createVendor(
        data.vendor
      );

      const registration =
        await registrationsService.createRegistration({
          vendorId: savedVendor.id,
          year: data.year,
        });

      for (const festival of data.festivals) {

        await paymentsService.createPayment({
          registrationId: registration.id,
          festivalId: festival.festivalId,
          position: festival.position,
          meters: festival.meters,
          amount: festival.amount,
        });

      }

    }

    await loadInitialData();

    setMessage(
      editingVendor
        ? "✅ Ο πωλητής ενημερώθηκε επιτυχώς."
        : "✅ Ο πωλητής προστέθηκε επιτυχώς."
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);

    setEditingVendor(null);
    setShowModal(false);

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Σφάλμα κατά την αποθήκευση."
    );
  }
}}
        />
    </div>
  );
}

export default Vendors;