import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import "./merged_styles.css";
import logo from "./images/bosse.png";
import { FormContext } from "./FormContext"; // Import the context
import RegisterModal from './register'; // Correct the path to where the RegisterModal file actually exists

const Form = () => {
  const { formData, setFormData } = useContext(FormContext); // Use context to manage form data
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State to handle modal visibility
  const [admissionMode, setAdmissionMode] = useState('');

  const [currentSubject, setCurrentSubject] = useState({
    subjectType: "",
    practicalMarks: "",
    assignmentMarks: "",
    theoryMarks: "",
    obtainedMarks: "",
    maximumMarks: "",
  });

  const count = location.state?.admissionsCount || parseInt(localStorage.getItem('admissionsCount'), 10) || 0;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username); // Assuming 'username' is the key in the token payload
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
    // Reset form data when the component mounts
    setFormData({
      admissionMode: "",
      admissionSession: "",
      course: "",
      studentName: "",
      fatherName: "",
      motherName: "",
      gender: "",
      dob: {
        day: "",
        month: "",
        year: "",
      },
      category: "",
      permanentAddress: "",
      country: "",
      state: "",
      city: "",
      pinCode: "",
      contactNumber: "",
      emailAddress: "",
      aadharNumber: "",
      educationDetails: {
        yearOfPassing: "",
        board: "",
        rollNumber: "",
        registrationNumber: "",
      },
      addedSubjects: [],
      selectedImage: null,
      imageError: "",
    });
    setErrors({});
  }, [setFormData, username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "admissionMode") {
      setAdmissionMode(value); // Update admissionMode state when it changes
    }

    if (name === "aadharNumber") {
      const isValidAadhar = /^\d{0,12}$/.test(value); // Allows up to 12 digits only
      if (!isValidAadhar) {
        setErrors({
          ...errors,
          aadharNumber: "Aadhar number must be exactly 12 digits long and numeric.",
        });
      } else {
        setErrors({
          ...errors,
          aadharNumber: "", // Clear any previous error
        });
      }
    }
  };

  const handleDobChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      dob: {
        ...formData.dob,
        [name]: value,
      },
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 200) {
        setFormData({
          ...formData,
          imageError: "Image size should be less than 200kb",
          selectedImage: null,
        });
      } else {
        setFormData({
          ...formData,
          selectedImageFile: file,
          selectedImage: URL.createObjectURL(file),
          imageError: "",
        });
      }
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    // Check all required fields
    if (!formData.admissionMode) {
      formIsValid = false;
      errors["admissionMode"] = "Admission Mode is required";
    }
    if (!formData.admissionSession) {
      formIsValid = false;
      errors["admissionSession"] = "Admission Session is required";
    }
    if (!formData.course) {
      formIsValid = false;
      errors["course"] = "Course is required";
    }
    if (!formData.studentName) {
      formIsValid = false;
      errors["studentName"] = "Student's Name is required";
    }
    if (!formData.fatherName) {
      formIsValid = false;
      errors["fatherName"] = "Father's Name is required";
    }
    if (!formData.motherName) {
      formIsValid = false;
      errors["motherName"] = "Mother's Name is required";
    }
    if (!formData.gender) {
      formIsValid = false;
      errors["gender"] = "Gender is required";
    }
    if (
      !formData.dob ||
      !formData.dob.day ||
      !formData.dob.month ||
      !formData.dob.year
    ) {
      formIsValid = false;
      errors["dob"] = "Complete Date of Birth is required";
    }
    if (!formData.category) {
      formIsValid = false;
      errors["category"] = "Category is required";
    }
    if (!formData.permanentAddress) {
      formIsValid = false;
      errors["permanentAddress"] = "Permanent Address is required";
    }
    if (!formData.country) {
      formIsValid = false;
      errors["country"] = "Country is required";
    }
    if (!formData.state) {
      formIsValid = false;
      errors["state"] = "State is required";
    }
    if (!formData.city) {
      formIsValid = false;
      errors["city"] = "City is required";
    }
    if (!formData.pinCode) {
      formIsValid = false;
      errors["pinCode"] = "Pin Code is required";
    }
    if (!formData.contactNumber) {
      formIsValid = false;
      errors["contactNumber"] = "Contact Number is required";
    }
    if (!formData.emailAddress) {
      formIsValid = false;
      errors["emailAddress"] = "Email Address is required";
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleEducationDetails = (e) => {
    const { name, value } = e.target;
  
    // Update the formData state by modifying the educationDetails object
    setFormData((prevState) => ({
      ...prevState,
      educationDetails: {
        ...prevState.educationDetails,
        [name]: value, // Dynamically update the property based on the input name
      },
    }));
  };

  const handleEducationDetailsChange = (e) => {
    const { name, value } = e.target;
    setCurrentSubject({
      ...currentSubject,
      [name]: value, // Update the specific field in currentSubject
    });
  };

  const handleAddSubject = () => {
    const { subjectType } = currentSubject;

    // Prevent adding an empty subject
    if (!subjectType) {
      alert("Please select a subject type before adding.");
      return;
    }

    // Add the current subject to the addedSubjects array
    setFormData((prevState) => ({
      ...prevState,
      addedSubjects: [...(prevState.addedSubjects || []), currentSubject],
    }));

    // Clear the current subject fields
    setCurrentSubject({
      subjectType: "",
      practicalMarks: "",
      assignmentMarks: "",
      theoryMarks: "",
      obtainedMarks: "",
      maximumMarks: "",
    });
  };

  const handleLogout = () => {
    localStorage.clear(); // Assuming you store user data in localStorage
    navigate("/login"); // Redirect to login page after logout
  };

  const handleNext = () => {
    if (validateForm()) {

      navigate("/docs");

      console.log(formData);
    } else {
      console.log("Form has errors.");
    }
  };

  const handleRegisterButtonClick = () => {
    setIsRegisterModalOpen(true); // Open the register modal when the custom button is clicked
  };

  const handleCloseModal = () => {
    setIsRegisterModalOpen(false); // Close the modal
  };

  const handleReset = () => {
    setFormData({
      admissionMode: "",
      admissionSession: "",
      course: "",
      studentName: "",
      fatherName: "",
      motherName: "",
      gender: "",
      dob: {
        day: "",
        month: "",
        year: "",
      },
      category: "",
      permanentAddress: "",
      country: "",
      state: "",
      city: "",
      pinCode: "",
      contactNumber: "",
      emailAddress: "",
      aadharNumber: "",
      educationDetails: {
        yearOfPassing: "",
        board: "",
        rollNumber: "",
        registrationNumber: "",
      },
      addedSubjects: [],
      selectedImage: null,
      imageError: "",
    });
    setErrors({});
    setCurrentSubject({
      subjectType: "",
      practicalMarks: "",
      assignmentMarks: "",
      theoryMarks: "",
      obtainedMarks: "",
      maximumMarks: "",
    });
  };

  return (
    <div>
      <header className="form-header">
        <div className="logo-section">
          <img src={logo} alt="Bosse Logo" className="logo" />
        </div>
        <h1 className="form-title">Student Application Form</h1>
        <div className="header-right">
          <div className="user-info">
            <span className="welcome-text">Welcome, {username}</span>
            <span className="admissions-count">Admission count - {count}</span>
          </div>
          {username === "kk92" && (
            <button className="custom-button" onClick={handleRegisterButtonClick}>
              Register New User
            </button>
          )}
          <button className="header-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <RegisterModal isOpen={isRegisterModalOpen} onClose={handleCloseModal} />

      <div className="form-container">
        <form>
          {/* Student's Photo */}
          <div className="photo-section">
            <label>Student's Photo</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.selectedImage && (
              <img
                src={formData.selectedImage}
                alt="Selected"
                className="image-preview"
              />
            )}
            {formData.imageError && (
              <p style={{ color: "red" }}>{formData.imageError}</p>
            )}
            <p>Note: The size of the photo should be less than 200kb</p>
          </div>

          {/* Details Section */}
          <div className="details-container">
            <div className="details-column">
              <h3>Details</h3>
              <label>Admission Mode *</label>
              <select
                name="admissionMode"
                value={formData.admissionMode || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Mode</option>
                <option value="FRESH">FRESH</option>
                <option value="TOC">TOC</option>
                <option value="PART ADMISSION">PART ADMISSION</option>
              </select>
              {errors.admissionMode && (
                <p style={{ color: "red" }}>{errors.admissionMode}</p>
              )}

              <label>Admission Session *</label>
              <select
                name="admissionSession"
                value={formData.admissionSession || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Session</option>
                <option value="BLOCK-1 2024 (M-24)">BLOCK-1 2024 (M-24)</option>
                <option value="BLOCK-2 2024 (M-24)">BLOCK-2 2024 (M-24)</option>
              </select>
              {errors.admissionSession && (
                <p style={{ color: "red" }}>{errors.admissionSession}</p>
              )}

              <label>Course (Applying for) *</label>
              <select
                name="course"
                value={formData.course || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Course</option>
                <option value="SECONDARY">SECONDARY</option>
                <option value="SENIOR-SECONDARY">SENIOR SECONDARY</option>
              </select>
              {errors.course && <p style={{ color: "red" }}>{errors.course}</p>}

              <label>Student's Name *</label>
              <div className="name-input">
                <select
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Title</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                </select>
                <input
                  name="studentName"
                  type="text"
                  value={formData.studentName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {errors.studentName && (
                <p style={{ color: "red" }}>{errors.studentName}</p>
              )}

              <label>Father's Name *</label>
              <input
                name="fatherName"
                type="text"
                value={formData.fatherName || ""}
                onChange={handleInputChange}
                required
              />
              {errors.fatherName && (
                <p style={{ color: "red" }}>{errors.fatherName}</p>
              )}

              <label>Mother's Name *</label>
              <input
                name="motherName"
                type="text"
                value={formData.motherName || ""}
                onChange={handleInputChange}
                required
              />
              {errors.motherName && (
                <p style={{ color: "red" }}>{errors.motherName}</p>
              )}

              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHERS">OTHERS</option>
              </select>
              {errors.gender && <p style={{ color: "red" }}>{errors.gender}</p>}

              <label>Date of Birth *</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  name="day"
                  value={formData.dob?.day || ""}
                  onChange={handleDobChange}
                  required
                >
                  <option value="" disabled>
                    Select Day
                  </option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  name="month"
                  value={formData.dob?.month || ""}
                  onChange={handleDobChange}
                  required
                >
                  <option value="" disabled>
                    Select Month
                  </option>
                  {months.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  name="year"
                  value={formData.dob?.year || ""}
                  onChange={handleDobChange}
                  required
                >
                  <option value="" disabled>
                    Select Year
                  </option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              {errors.dob && <p style={{ color: "red" }}>{errors.dob}</p>}

              <label>Category *</label>
              <select
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="GEN">GEN</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="NRI">NRI</option>
                <option value="FOREIGN NATIONAL">FOREIGN NATIONAL</option>
              </select>
              {errors.category && (
                <p style={{ color: "red" }}>{errors.category}</p>
              )}
            </div>

            <div className="details-column">
              <h3>Details</h3>
              <label>Permanent Address *</label>
              <div className="address-input">
                <input
                  name="permanentAddress"
                  type="text"
                  value={formData.permanentAddress || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {errors.permanentAddress && (
                <p style={{ color: "red" }}>{errors.permanentAddress}</p>
              )}

              <label>Country *</label>
              <CountryDropdown
                value={formData.country || ""}
                onChange={(val) => setFormData({ ...formData, country: val })}
                required
              />
              {errors.country && (
                <p style={{ color: "red" }}>{errors.country}</p>
              )}

              <label>State *</label>
              <RegionDropdown
                country={formData.country}
                value={formData.state || ""}
                onChange={(val) => setFormData({ ...formData, state: val })}
                required
              />
              {errors.state && <p style={{ color: "red" }}>{errors.state}</p>}

              <label>City *</label>
              <input
                name="city"
                type="text"
                value={formData.city || ""}
                onChange={handleInputChange}
                required
              />
              {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}

              <label>Pin Code *</label>
              <input
                name="pinCode"
                type="text"
                value={formData.pinCode || ""}
                onChange={handleInputChange}
                required
              />
              {errors.pinCode && (
                <p style={{ color: "red" }}>{errors.pinCode}</p>
              )}

              <label>Contact No. *</label>
              <input
                name="contactNumber"
                type="tel"
                value={formData.contactNumber || ""}
                onChange={handleInputChange}
                required
              />
              {errors.contactNumber && (
                <p style={{ color: "red" }}>{errors.contactNumber}</p>
              )}

              <label>Email Address *</label>
              <input
                name="emailAddress"
                type="email"
                value={formData.emailAddress || ""}
                onChange={handleInputChange}
                required
              />
              {errors.emailAddress && (
                <p style={{ color: "red" }}>{errors.emailAddress}</p>
              )}

              <label>Aadhar No.</label>
              <input
                name="aadharNumber"
                type="text"
                value={formData.aadharNumber || ""}
                onChange={handleInputChange}
                maxLength="12" // This limits the input length to 12 characters in the input field
              />
              {errors.aadharNumber && (
                <span style={{ color: "red" }}>{errors.aadharNumber}</span>
              )}
            </div>
          </div>

          {/* Educational Qualifications Section */}
          {admissionMode === "TOC" && (
            <div className="education-section">
              <h3>Details of Last Class/Examination Passed</h3>

              {/* Input Fields for Educational Qualifications */}
              <div className="qualification-grid">
                <div className="input-group">
                  <label>Subject Type:</label>
                  <select
                    name="subjectType"
                    value={currentSubject.subjectType || ""}
                    onChange={handleEducationDetailsChange}
                  >
                    <option value="">Select Subject Type</option>
                    <option value="Language">Language</option>
                    <option value="Non-Language">Non-Language</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Practical Marks:</label>
                  <input
                    type="text"
                    name="practicalMarks"
                    value={currentSubject.practicalMarks || ""}
                    onChange={handleEducationDetailsChange}
                  />
                </div>

                <div className="input-group">
                  <label>Assignment Marks:</label>
                  <input
                    type="text"
                    name="assignmentMarks"
                    value={currentSubject.assignmentMarks || ""}
                    onChange={handleEducationDetailsChange}
                  />
                </div>

                <div className="input-group">
                  <label>Theory Marks:</label>
                  <input
                    type="text"
                    name="theoryMarks"
                    value={currentSubject.theoryMarks || ""}
                    onChange={handleEducationDetailsChange}
                  />
                </div>

                <div className="input-group">
                  <label>Obtained Marks:</label>
                  <input
                    type="text"
                    name="obtainedMarks"
                    value={currentSubject.obtainedMarks || ""}
                    onChange={handleEducationDetailsChange}
                  />
                </div>

                <div className="input-group">
                  <label>Maximum Marks:</label>
                  <input
                    type="text"
                    name="maximumMarks"
                    value={currentSubject.maximumMarks || ""}
                    onChange={handleEducationDetailsChange}
                  />
                </div>

                {/* Empty placeholders to ensure the button is at the bottom right */}
                <div className="empty-space"></div>
                <div className="empty-space"></div>

                <button type="button" onClick={handleAddSubject} className="add-subject-button">
                  Add Subject
                </button>
              </div>

              {/* List of Added Subjects */}
              <div className="subject-list">
                <h4>Added Subjects:</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Subject Type</th>
                      <th>Practical Marks</th>
                      <th>Assignment Marks</th>
                      <th>Theory Marks</th>
                      <th>Obtained Marks</th>
                      <th>Maximum Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.addedSubjects?.map((subject, index) => (
                      <tr key={index} style={{ backgroundColor: 'white'}}>
                        <td>{subject.subjectType}</td>
                        <td>{subject.practicalMarks}</td>
                        <td>{subject.assignmentMarks}</td>
                        <td>{subject.theoryMarks}</td>
                        <td>{subject.obtainedMarks}</td>
                        <td>{subject.maximumMarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="education-section">
            <h3>Details Of Educational Qualifications</h3>

            {/* Static Fields */}
            <div className="qualification-row">
              <label>Year of Passing:</label>
              <input
                type="text"
                name="yearOfPassing"
                value={formData.educationDetails?.yearOfPassing || ""}
                onChange={(e) => handleEducationDetails({ target: { name: 'yearOfPassing', value: e.target.value } })}
                required
              />
              {errors.yearOfPassing && (
                <p style={{ color: "red" }}>{errors.yearOfPassing}</p>
              )}

              <label>Board:</label>
              <input
                type="text"
                name="board"
                value={formData.educationDetails?.board || ""}
                onChange={(e) => handleEducationDetails({ target: { name: 'board', value: e.target.value } })}
                required
              />
              {errors.board && <p style={{ color: "red" }}>{errors.board}</p>}

              <label>Roll Number:</label>
              <input
                type="text"
                name="rollNumber"
                value={formData.educationDetails?.rollNumber || ""}
                onChange={(e) => handleEducationDetails({ target: { name: 'rollNumber', value: e.target.value } })}
                required
              />
              {errors.rollNumber && (
                <p style={{ color: "red" }}>{errors.rollNumber}</p>
              )}

              <label>Registration Number:</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.educationDetails?.registrationNumber || ""}
                onChange={(e) => handleEducationDetails({ target: { name: 'registrationNumber', value: e.target.value } })}
                required
              />
              {errors.registrationNumber && (
                <p style={{ color: "red" }}>{errors.registrationNumber}</p>
              )}
            </div>
          </div>
          <div className="button-container">
            <button type="reset" className="reset-button" onClick={handleReset}>
              Reset
            </button>
            <button type="button" className="next-button" onClick={handleNext}>
              Next
            </button>
          </div>
          <footer className="form-footer">
            <p>&copy; 2024 https://panel.org.in All rights reserved.</p>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default Form;