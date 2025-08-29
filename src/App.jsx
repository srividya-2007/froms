// Import React library and the useState hook
import React, { useState } from "react";

// Import CSS styles for this component
import "./App.css";

/*
  initialForm:
  - This object represents the default/empty state of our form.
  - We use it to initialize state and to reset the form after submission.
*/
const initialForm = {
   firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    dob: "",
    password: "",
    confirmPassword: "",
    terms: false,
};

function App() {
  /*
    -------------------------------
    useState Hooks
    -------------------------------
    - formData: Holds the current values typed by the user in the form fields.
    - errors: Holds the validation error messages for each field.
    - touched: Tracks whether a field has been visited (blurred) at least once.

    Example:
      If a user types "abc" in email and clicks away, touched.email = true.
      If email is invalid, errors.email = "Email address is invalid".
  */
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /*
    validateField(name, value, allValues):
    --------------------------------------
    - Validates a single field based on its name.
    - Called in 2 places:
        1) inside handleBlur → "field-level validation" (onBlur event)
        2) inside validateForm → "form-level validation" (onSubmit event)

    Returns:
      "" (empty string) if valid,
      otherwise returns an error message string.
  */
  const validateField = (name, value, allValues = formData) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        return "";
      case "email":
        if (!value) return "Email is required";
        // Simple regex check for email format
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Email address is invalid";
        return "";
      case "phone":
      if (!value) return "Phone number is required";
      if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
      return "";

    case "dob":
      if (!value) return "Date of Birth is required";
      // Optional: age check (e.g., must be at least 18 years old)
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) return "You must be at least 18 years old";
      return "";

    case "country":
      if (!value) return "Country is required";
      return "";

   case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Confirm Password is required";
        if (value !== allValues.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  /*
    validateForm():
    ----------------
    - Validates ALL fields together.
    - Loops through formData and applies validateField for each.
    - Updates the errors state.
    - Called inside handleSubmit (onSubmit event).

    Returns:
      true  → if the form has NO errors
      false → if there are errors
  */
  const validateForm = () => {
    const nextErrors = {};
    Object.keys(formData).forEach((key) => {
      const msg = validateField(key, formData[key], formData);
      if (msg) nextErrors[key] = msg;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  /*
    handleChange(e):
    -----------------
    - Runs every time the user types inside an input.
    - Updates formData with the new value.
    - If the field was already "touched", we also validate it live,
      so students can see instant feedback after first blur.
  */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Live validation only after field has been blurred once
    if (touched[name]) {
      const msg = validateField(name, value, updated);
      setErrors((prev) => ({ ...prev, [name]: msg || undefined }));
    }
  };

  /*
    handleBlur(e):  *** FIELD-LEVEL VALIDATION ***
    ------------------------------------------------
    - This is triggered when the user moves focus AWAY from an input.
    - Example: typing in email and then clicking on password.
    - We mark that field as touched, and then validate JUST that field.
    - This demonstrates onBlur validation (field-level).
  */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const msg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: msg || undefined }));
  };

  /*
    handleSubmit(e):  *** FORM-LEVEL VALIDATION ***
    ------------------------------------------------
    - Triggered when the user clicks the "Submit" button.
    - Prevents default form submission (page reload).
    - Marks ALL fields as touched (so errors for untouched fields show too).
    - Calls validateForm() to run full-form validation.
    - If the form is valid:
        * Shows an alert
        * Clears the form (reset state to initialForm)
        * Clears errors and touched state.
    - Demonstrates onSubmit validation (form-level).
  */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched, so all errors display
    setTouched({
      name: true,
      email: true,
      password: true,
      phone:true,
      confirmPassword: true,
    });

    if (validateForm()) {
      alert("Form Submitted Successfully ✅");
      // Reset form values and states
      setFormData(initialForm);
      setErrors({});
      setTouched({});
    }
  };

  /*
    -------------------------------
    JSX Render Section
    -------------------------------
    - .page → flex container (centered using CSS)
    - .card → white background container for the form
    - Each input is linked to formData via value + onChange
    - Each input runs handleBlur for field-level validation
    - Form runs handleSubmit for form-level validation
  */
  return (
    <>
     <header>
          <div className='logo'>Input Validation</div>
        </header>
      <div className="page">
        <div className="card">
          <h2>Create Account</h2>

          {/* noValidate disables browser’s built-in validation bubbles */}
          <form onSubmit={handleSubmit} noValidate class="form-grid">
           
            {/* ---------------- Name Field ---------------- */}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}  // <-- FIELD-LEVEL VALIDATION happens here
                aria-invalid={!!errors.name}
                aria-describedby="name-error"
              />
              {errors.name && (
                <span id="name-error" className="error">
                  {errors.name}
                </span>
              )}
            </div>

            {/* ---------------- Email Field ---------------- */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}  // <-- FIELD-LEVEL VALIDATION happens here
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              {errors.email && (
                <span id="email-error" className="error">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="form-group">
  <label htmlFor="phone">Phone Number</label>
  <input
    id="phone"
    name="phone"
    type="tel"
    placeholder="Enter your phone number"
    value={formData.phone}
    onChange={handleChange}
    onBlur={handleBlur}
    aria-invalid={!!errors.phone}
    aria-describedby="phone-error"
  />
  {errors.phone && (
    <span id="phone-error" className="error">
      {errors.phone}
    </span>
  )}
</div>

{/* ---------------- Date of Birth Field ---------------- */}
<div className="form-group">
  <label htmlFor="dob">Date of Birth</label>
  <input
    id="dob"
    name="dob"
    type="date"
    value={formData.dob}
    onChange={handleChange}
    onBlur={handleBlur}
    aria-invalid={!!errors.dob}
    aria-describedby="dob-error"
  />
  {errors.dob && (
    <span id="dob-error" className="error">
      {errors.dob}
    </span>
  )}
</div>

{/* ---------------- Country Field ---------------- */}
<div className="form-group">
  <label htmlFor="country">Country</label>
  <input
    id="country"
    name="country"
    type="text"
    placeholder="Enter your country"
    value={formData.country}
    onChange={handleChange}
    onBlur={handleBlur}
    aria-invalid={!!errors.country}
    aria-describedby="country-error"
  />
  {errors.country && (
    <span id="country-error" className="error">
      {errors.country}
    </span>
  )}
</div>
           
       

            {/* ---------------- Password Field ---------------- */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}  // <-- FIELD-LEVEL VALIDATION happens here
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              {errors.password && (
                <span id="password-error" className="error">
                  {errors.password}
                </span>
              )}
            </div>

            {/* ---------------- Confirm Password Field ---------------- */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}  // <-- FIELD-LEVEL VALIDATION happens here
                aria-invalid={!!errors.confirmPassword}
                aria-describedby="confirmPassword-error"
              />
              {errors.confirmPassword && (
                <span id="confirmPassword-error" className="error">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit button → triggers handleSubmit (FORM-LEVEL VALIDATION) */}
            <button type="submit">Register</button>
          </form>

         
        </div>
      </div>
    </>
  );
}

// Export App component
export default App;
