import { useEffect, useState } from "react";


const emptyVendor = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  afm: "",
  notes: "",
};

const createEmptyFestivalState = (festivals) => {
  const state = {};

  festivals.forEach((festival) => {
    state[festival.id] = {
      checked: false,
      paymentId: null,
      amount: "",
      position: "",
      meters: "",
    };
  });

  return state;
};

function VendorModal({
  isOpen,
  onClose,
  onSave,
  vendor,
  payments,
  registrations,
  festivals,
}) {
  const getInitialForm = () => {
    if (!vendor) return emptyVendor;
    return {
      firstName: vendor.firstName,
      lastName: vendor.lastName,
      phone: vendor.phone,
      email: vendor.email,
      afm: vendor.afm || "",
      notes: vendor.notes || "",
    };
  };

  const getInitialYear = () => {
  if (!vendor) return "2026";

  const registration = registrations.find(
    (r) => r.vendorId === vendor.id
  );

  return registration
    ? registration.year.toString()
    : "2026";
};

  const getFestivalData = (selectedYear) => {
  const newFestivalState = createEmptyFestivalState(festivals);

  if (!vendor) return newFestivalState;

  const registration = registrations.find(
    (r) =>
      r.vendorId === vendor.id &&
      r.year.toString() === selectedYear.toString()
  );

  if (!registration) return newFestivalState;

  const vendorPayments = payments.filter(
    (p) => p.registrationId === registration.id
  );

  vendorPayments.forEach((payment) => {
    newFestivalState[payment.festivalId] = {
      checked: true,
      paymentId: payment.id,
      amount: payment.amount.toString(),
      position: payment.position || "",
      meters: payment.meters?.toString() || "",
    };
  });

  return newFestivalState;
};

  const [form, setForm] = useState(getInitialForm());

  const [year, setYear] = useState(getInitialYear());

  const [festivalData, setFestivalData] = useState(
  createEmptyFestivalState(festivals)
);

  useEffect(() => {
    if (!isOpen) return;

    const initialYear = getInitialYear();

    setForm(getInitialForm());
    setYear(initialYear);
     setFestivalData(getFestivalData(initialYear));
  }, [vendor, payments,registrations, festivals, isOpen]);

 

  if (!isOpen) return null;

  

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFestivalCheck(id) {
    setFestivalData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        checked: !prev[id].checked,
      },
    }));
  }

  function handleFestivalAmount(id, value) {
    setFestivalData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        amount: value,
      },
    }));
  }

  function handleFestivalPosition(id, value) {
  setFestivalData((prev) => ({
    ...prev,
    [id]: {
      ...prev[id],
      position: value,
    },
  }));
}
function handleFestivalMeters(id, value) {
  setFestivalData((prev) => ({
    ...prev,
    [id]: {
      ...prev[id],
      meters: value,
    },
  }));
}

  function handleSubmit(e) {
    e.preventDefault();

    const selectedFestivals = festivals
  .filter(
    (festival) =>
      festivalData[festival.id].checked
  )
  .map((festival) => ({
  paymentId: festivalData[festival.id].paymentId,

  festivalId: festival.id,

  amount: Number(
    festivalData[festival.id].amount
  ),

  position:
    festivalData[festival.id].position,

  meters: Number(
    festivalData[festival.id].meters
  ),
}));

onSave({
  vendor: {
      id: vendor?.id,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      afm: form.afm,
      notes: form.notes,
  },

  year: Number(year),

  festivals: selectedFestivals,
});

    setForm(emptyVendor);

    setYear("2026");

    setFestivalData(createEmptyFestivalState(festivals));

    onClose();
  }

  function handleClose() {

    setForm(emptyVendor);

    setYear("2026");

    setFestivalData(createEmptyFestivalState(festivals));

    onClose();

  }
    return (
    <div
      className="modal-overlay"
      onClick={handleClose}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>
          {vendor
            ? "Επεξεργασία Πωλητή"
            : "Νέος Πωλητής"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="firstName"
            placeholder="Όνομα"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Επώνυμο"
            value={form.lastName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Τηλέφωνο"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
             type="text"
             name="afm"
             placeholder="ΑΦΜ"
             value={form.afm}
             onChange={handleChange}
             maxLength={9}
          />

      <textarea
        name="notes"
        placeholder="Παρατηρήσεις"
        value={form.notes}
        onChange={handleChange}
        rows={4}
      />

          <label>Έτος</label>

          <select
              value={year}
              onChange={(e) => {
              const selectedYear = e.target.value;

             setYear(selectedYear);
             setFestivalData(getFestivalData(selectedYear));
            }}
          >
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
          </select>

          <h3 style={{ marginTop: "20px" }}>
            Πανηγύρια
          </h3>

          {festivals.map((festival) => (

            <div
              key={festival.id}
              className="festival-row"
            >

              <label className="festival-check">

                <input
                  type="checkbox"
                  checked={
                    festivalData[festival.id]?.checked || false
                  }
                  onChange={() =>
                    handleFestivalCheck(festival.id)
                  }
                />

                {festival.name}

              </label>

             {festivalData[festival.id]?.checked && (
  <div className="festival-inputs">

    <div className="festival-field">
      <label>Θέση</label>
      <input
        type="text"
        value={festivalData[festival.id].position}
        onChange={(e) =>
          handleFestivalPosition(
            festival.id,
            e.target.value
          )
        }
      />
    </div>

    <div className="festival-field">
      <label>Μέτρα</label>
      <input
        type="number"
        value={festivalData[festival.id].meters}
        onChange={(e) =>
          handleFestivalMeters(
            festival.id,
            e.target.value
          )
        }
      />
    </div>

    <div className="festival-field">
      <label>Ποσό (€)</label>
      <input
        type="number"
        value={festivalData[festival.id].amount}
        onChange={(e) =>
          handleFestivalAmount(
            festival.id,
            e.target.value
          )
        }
      />
    </div>

  </div>
)}

            </div>

          ))}

          <div className="modal-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={handleClose}
            >
              Ακύρωση
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              Αποθήκευση
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default VendorModal;
