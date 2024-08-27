import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./merged_styles.css"; // Importing the CSS file
import BosseLogo from "./images/bosse.jpg"; // Import the BOSSE logo
import { FormContext } from "./FormContext"; // Import the context

const SubjectSelectionForm = () => {
  const { formData, documents } = useContext(FormContext); // Use formData from context
  const navigate = useNavigate();
  const location = useLocation();

  const [languageSubjects, setLanguageSubjects] = useState([]);
  const [nonLanguageSubjects, setNonLanguageSubjects] = useState([]);
  const [vocationalSubjects, setVocationalSubjects] = useState([]);

  const languageOptions = [
    "HINDI",
    "ENGLISH",
    "URDU",
    "BENGALI",
    "PUNJABI",
    "ASSAMESE",
    "NEPALI",
    "ODIA",
    "KANNADA",
    "MALAYALAM",
    "TAMIL",
    "TELUGU",
  ];

  const nonLanguageOptions = [
    "MATHEMATICS",
    "SCIENCE AND TECHNOLOGY (P)*",
    "SOCIAL SCIENCE",
    "ECONOMICS",
    "BUSINESS STUDIES",
    "PSYCHOLOGY (P)*",
    "INDIAN CULTURE AND HERITAGE",
    "ACCOUNTANCY",
    "HOME SCIENCE & HUMAN ECOLOGY (P)*",
  ];

  const vocationalOptions = [
    "CARPENTRY (P)*",
    "SOLAR ENERGY TECHNICIAN (P)*",
    "BIO GAS TECHNICIAN (P)*",
    "LAUNDRY SERVICES (P)*",
    "BAKERY AND CONFECTIONERY (P)*",
    "WELDING TECHNOLOGY (P)*",
    "DATA ENTRY OPERATIONS (P)*",
    "PAINTING & DRAWING (P)*",
  ];

  const handleLanguageChange = (subject) => {
    setLanguageSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleNonLanguageChange = (subject) => {
    setNonLanguageSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleVocationalChange = (subject) => {
    setVocationalSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleLogout = () => {
    localStorage.clear(); // Assuming you store user data in localStorage
    navigate("/login"); // Redirect to login page after logout
  };

  const handleSubmit = async (e) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    e.preventDefault();

    // Prepare form data
    const formDataToSend = new FormData();

    // Add form fields to formData
    for (const key in formData) {
      if (key === "dob" || key === "educationDetails") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    if (formData.selectedImageFile) {
      formDataToSend.append("studentPhoto", formData.selectedImageFile);
    }

    // Add documents (including files)
    documents.forEach((doc, index) => {
      if (doc.file) {
        formDataToSend.append(`document_${doc.title}`, doc.file, doc.fileName);
      }
      formDataToSend.append(`yearOfPassing_${doc.title}`, doc.yearOfPassing);
    });

    // Add selected subjects
    formDataToSend.append("languageSubjects", JSON.stringify(languageSubjects));
    formDataToSend.append(
      "nonLanguageSubjects",
      JSON.stringify(nonLanguageSubjects)
    );
    formDataToSend.append(
      "vocationalSubjects",
      JSON.stringify(vocationalSubjects)
    );

    const token = localStorage.getItem("jwt");

    try {
      const response = await fetch(backendUrl + "/forms", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`, // Add JWT token to the header
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formNumber = data.formNumber;
        console.log("Form submitted successfully");
        navigate("/success", { state: { formNumber } }); // Navigate to a success page or somewhere else
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <div className="logo-section">
        <img src={BosseLogo} alt="Bosse Logo" className="logo" />
      </div>
      <div className="form-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <div className="header">
          <h2 className="form-title">Select Subject</h2>
        </div>
        <p className="form-notes">
          <b>Notes:</b>
          <br />
          (P) denotes that Subject includes practical.
          <br />
          You can select Minimum 1 & Maximum 2 in Language Subjects.
          <br />
          You can select Minimum 2 & Maximum 4 in Non-Language Subjects.
          <br />
          You can select Maximum 2 in Vocational Subjects.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="subject-container">
            <div className="subject-category language-subjects">
              <h3>Language Subject</h3>
              {languageOptions.map((subject) => (
                <div key={subject} className="subject-option">
                  <input
                    type="checkbox"
                    checked={languageSubjects.includes(subject)}
                    onChange={() => handleLanguageChange(subject)}
                    disabled={
                      !languageSubjects.includes(subject) &&
                      languageSubjects.length >= 2
                    }
                  />
                  <label className="subject-label">{subject}</label>
                </div>
              ))}
            </div>

            <div className="subject-category non-language-subjects">
              <h3>Non-Language Subject</h3>
              {nonLanguageOptions.map((subject) => (
                <div key={subject} className="subject-option">
                  <input
                    type="checkbox"
                    checked={nonLanguageSubjects.includes(subject)}
                    onChange={() => handleNonLanguageChange(subject)}
                    disabled={
                      !nonLanguageSubjects.includes(subject) &&
                      nonLanguageSubjects.length >= 4
                    }
                  />
                  <label className="subject-label">{subject}</label>
                </div>
              ))}
            </div>

            <div className="subject-category vocational-subjects">
              <h3>Vocational Subject</h3>
              {vocationalOptions.map((subject) => (
                <div key={subject} className="subject-option">
                  <input
                    type="checkbox"
                    checked={vocationalSubjects.includes(subject)}
                    onChange={() => handleVocationalChange(subject)}
                    disabled={
                      !vocationalSubjects.includes(subject) &&
                      vocationalSubjects.length >= 2
                    }
                  />
                  <label className="subject-label">{subject}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="button-container">
            <button type="button" className="back-button" onClick={handleBack}>
              Back
            </button>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectSelectionForm;
