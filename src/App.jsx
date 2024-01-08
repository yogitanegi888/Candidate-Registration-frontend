import logo from './logo.svg';
import './App.css';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { BASE_URL } from './utilitis';
import * as Yup from 'yup';
import { useState } from 'react';
import axios from "axios"
function App() {
  const [isSameAsResidential, setIsSameAsResidential] = useState(false);
  const documents = {};
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    residentialStreet1: '',
    residentialStreet2: '',
    permanentStreet1: '',
    permanentStreet2: '',
    documents: [{
      filename: '',
      filetype: '',
      file: ''
    }]
  };

  const handleSubmit = async (data) => {
    console.log("data", data)
    if (data.documents.length < 2) {
      alert("minimum two Documents are required")
      return
    }
    let formData = new FormData();

    for (let i = 0; i < data.documents.length; i++) {
      formData.append('document', data.documents[i].file);
    }
    formData.append("payload", JSON.stringify(data));
    // await fetch('https://www.google.com', {method: 'POST', body: formData});
    try {
      let response = await axios.post(`${BASE_URL}/createDetails`, formData, {
      });
      if (response.data.status == 200) {
        alert("Candidate is Successfully  Registration")
      } else {

      }
    } catch (error) {

    }
  }
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    residentialStreet1: Yup.string().required('Residential Address 1 is required'),
    residentialStreet2: Yup.string().required('Residential Address 2 is required'),
    permanentStreet1: Yup.string().required('permanent  Address 1  is required'),
    permanentStreet2: Yup.string().required('permanent Address 2 is required'),
    documents: Yup.array().of(
      Yup.object().shape({
        filename: Yup.string().required('Filename is required'),
        filetype: Yup.string().required('File Type is required'),
        file: Yup.mixed().required('Upload Document is required'),
      })
    ),
  });

  return (
    <div className="container-md">
      <div className='form-container'>
        <h3>Candidate Registration</h3>
        <hr />
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} >


          {({ values, handleChange, handleBlur, setFieldValue, }) => (

            <Form>
              <div className="form-row">
                <div className="form-group col">
                  <label htmlFor="firstName" className='required'>First Name</label>
                  <ErrorMessage name="firstName" component="div" className="error-message" />
                  <Field type="text" name='firstName' className='form-control' placeholder='Enter your first name here' />

                </div>
                <div className="form-group col">
                  <label htmlFor="lastName" className='required'>Last Name</label>
                  <ErrorMessage name="lastName" component="div" className="error-message" />
                  <Field type="text" name='lastName' className='form-control' placeholder='Enter your last name here' />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col">
                  <label htmlFor="email" className='required'>Email</label>
                  <ErrorMessage name="email" component="div" className="error-message" />
                  <Field type="email" name='email' className='form-control' placeholder='ex. myname@gmail.com' />
                </div>
                <div className="form-group col">
                  <label htmlFor="lastName" className='required'>Date Of Birth</label>
                  <ErrorMessage name="dateOfBirth" component="div" className="error-message" />
                  <Field type="date" name='dateOfBirth' className='form-control' />
                </div>
              </div>
              <div className="form-row">
                <legend>Residential Address</legend>
                <div className="form-group col">
                  <label htmlFor="address1" className='required'>Address 1</label>
                  <ErrorMessage name="residentialStreet1" component="div" className="error-message" />
                  <Field type="text" name='residentialStreet1' className='form-control' />
                </div>
                <div className="form-group col">
                  <label htmlFor="address2" className='required'>Address 2</label>
                  <ErrorMessage name="residentialStreet2" component="div" className="error-message" />

                  <Field type="text" name='residentialStreet2' className='form-control' />
                </div>
              </div>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-Field"
                  id="customCheck1"
                  checked={isSameAsResidential}
                  onChange={() => {
                    setIsSameAsResidential(!isSameAsResidential);
                    if (!isSameAsResidential) {
                      setFieldValue('permanentStreet1', values.residentialStreet1);
                      setFieldValue('permanentStreet2', values.residentialStreet2);
                    } else {
                      setFieldValue('permanentStreet1', '');
                      setFieldValue('permanentStreet2', '');
                    }
                  }}
                />
                <label className="custom-control-label" class='required' for="customCheck1">Same as Residential Address</label>
              </div>
              <div className="form-row">
                <legend>Permanent Address</legend>
                <div className="form-group col">
                  <label htmlFor="address1">Address 1</label>
                  <ErrorMessage name="permanentStreet1" component="div" className="error-message" />

                  <Field type="text" name="permanentStreet1" className='form-control' />
                </div>
                <div className="form-group col">
                  <label htmlFor="address2" >Address 2</label>
                  <ErrorMessage name="permanentStreet2" component="div" className="error-message" />

                  <Field type="text" name="permanentStreet2" className='form-control' />
                </div>
              </div>
              <strong>Upload Documents</strong>
              <FieldArray name='documents'>
                {(arrayHelpers) => (
                  values.documents.map((document, index) => {

                    return (<div className="form-row" key={index}>
                      <div className="form-group col">
                        <label htmlFor="address1" className='required'>Filename</label>
                        <ErrorMessage name={`documents[${index}].filename`} component="div" className="error-message" />

                        <Field type="text" name={`documents[${index}].filename`} className='form-control' />
                      </div>
                      <div className="form-group col">
                        <label htmlFor="address2" className='required'>File Type</label>
                        <ErrorMessage name={`documents[${index}].filetype`} component="div" className="error-message" />

                        <Field component="select" name={`documents[${index}].filetype`} className='form-control'>
                          <option value="image">Image</option>
                          <option value="pdf">PDF</option>
                        </Field>
                      </div>
                      <div className="form-group col">
                        <label htmlFor="" className='required'>Upload Document</label>
                        <div className="custom-file">
                          <input type="file" name={`documents[${index}].file`} onChange={(event) => setFieldValue(`documents[${index}].file`, event.target.files[0])} onBlur={handleBlur} className="custom-file-Field" id={`customFile-${index}`} />
                          <label className="custom-file-label" for={`customFile-${index}`}>Choose file</label>
                        </div>
                      </div>
                      <div className='form-group col'>
                        {index === (values.documents.length - 1) && <button className='btn btn-primary btn-sm add-button' type='button' onClick={() => arrayHelpers.push({
                          filename: '',
                          filetype: '',
                          file: ''
                        })}>
                          <i className="fa-solid fa-plus"></i>
                        </button>}
                        {index > 1 && <button className='btn btn-danger btn-sm delete-button' type='button' onClick={() => arrayHelpers.remove(index)}>
                          <i className="fa-solid fa-trash"></i>
                        </button>}
                      </div>
                    </div>)
                  })
                )}
              </FieldArray>
              <div className="form-row action-row">
                <button type='submit' className='btn btn-primary'>Submit</button>
                <button type='reset' className='btn btn-secondary'>Reset</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default App;
