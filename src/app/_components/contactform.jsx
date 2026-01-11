"use client";

import { useState, useEffect } from "react";

export default function ContactForm() {
  const [recipientEmail, setRecipientEmail] = useState("hkaras1121@gmail.com");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch recipient email from database
    const fetchEmail = async () => {
      try {
        const response = await fetch(
          "/api/pagecontent?page=contact&section=content"
        );
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            const emailData = data.data.find(
              (c) => c.key === "contact-content-email"
            );
            if (emailData) {
              setRecipientEmail(emailData.content);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching recipient email:", error);
      }
    };
    fetchEmail();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recipientEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full mb-20 fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
          <span className="gradient-text">Send Me a Message</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Have a question or want to work together? Get in touch!
        </p>
      </div>

      <div className="glass rounded-2xl p-8 border border-orange-500/20 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
              placeholder="Tell me about your project, question, or opportunity..."
            />
          </div>

          {status.message && (
            <div
              className={`p-4 rounded-lg ${
                status.type === "success"
                  ? "bg-green-500/20 border border-green-500/50 text-green-300"
                  : "bg-red-500/20 border border-red-500/50 text-red-300"
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 hover-lift"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
