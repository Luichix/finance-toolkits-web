import React, { useState } from "react";
import useAlert from "@lib/utils/useAlert";
import emailjs from "@emailjs/browser";
import { Alert } from "@components/common/Alert";

const Contact = () => {
  const [show, info, alert, showAlert] = useAlert();

  const maxLength = 350; // Cambia esto al número máximo de caracteres permitidos
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [message, setMessage] = useState("");

  const handleTextAreaChange = (value: string) => {
    const inputValue = value;

    if (inputValue.length <= maxLength) {
      setMessage(inputValue);
    }
  };

  const handleSendEmail = (e: any) => {
    e.preventDefault();

    const messageObject = {
      name,
      email,
      issue,
      message,
    };

    emailjs
      .send(
        "service_4wymdde",
        "template_financial",
        messageObject,
        "-go0pC4oFwjAo9l-c",
      )
      .then(
        (response) => {
          showAlert(["The message was sent successfully.!"], "success");
          setName("");
          setEmail("");
          setIssue("");
          setMessage("");
        },
        (err) => {
          showAlert(["There was a problem sending the message.!"], "error");
        },
      );
  };
  return (
    <form
      onSubmit={handleSendEmail}
      className="contact-form row gy-2 justify-center"
    >
      <Alert show={show} alert={alert} message={info} />
      <div className="lg:col-6">
        <label className="mb-2 block" htmlFor="name">
          Name <span className="text-red-600">*</span>
        </label>
        <input
          className="form-input w-full"
          name="name"
          type="text"
          value={name}
          onChange={({ target }) => setName(target.value)}
          required
        />
      </div>
      <div className="lg:col-6">
        <label className="mb-2 block" htmlFor="email">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          className="form-input w-full"
          name="email"
          type="email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          required
        />
      </div>
      <div className="col-12">
        <label className="mb-2 block" htmlFor="subject">
          Issue
        </label>
        <input
          className="form-input w-full"
          name="subject"
          type="text"
          value={issue}
          onChange={({ target }) => setIssue(target.value)}
        />
      </div>
      <div className="col-12">
        <label className="mb-2 block" htmlFor="message">
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          className="form-textarea w-full"
          rows={4}
          value={message}
          onChange={({ target }) => handleTextAreaChange(target.value)}
        ></textarea>
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-primary mt-2">
          Send Now
        </button>
      </div>
    </form>
  );
};

export default Contact;
