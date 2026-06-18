"use client";

import React from "react";

export default function SupplierEnquiriesPage() {
  const enquiries = [
    {
      id: 1,
      buyer: "Metro Crafts Retail",
      product: "Premium Leather Bag",
      phone: "+91 9890001112",
      message: "Need 300 units, private label possible?",
      date: "08 Apr 2026",
      status: "Pending",
      statusClass: "status-warning"
    },
    {
      id: 2,
      buyer: "DeshMart",
      product: "Travel Wallet Set",
      phone: "+91 9811100345",
      message: "Share catalog and packing details.",
      date: "07 Apr 2026",
      status: "Replied",
      statusClass: "status-success"
    }
  ];

  return (
    <div className="dashboard-content">
      <header className="page-title">
        <span className="eyebrow">Buyer Enquiries</span>
        <h1>Supplier Enquiry Management</h1>
        <p>Review buyer communications and maintain timely response records.</p>
      </header>

      <section className="panel table-shell">
        <div className="panel-head">
          <div>
            <h2>Enquiry Register</h2>
            <p className="panel-meta">Operational actions for supplier communication.</p>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Buyer Name</th>
              <th>Product Interested</th>
              <th>Contact</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map(enquiry => (
              <tr key={enquiry.id}>
                <td>{enquiry.buyer}</td>
                <td>{enquiry.product}</td>
                <td>{enquiry.phone}</td>
                <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{enquiry.message}</td>
                <td>{enquiry.date}</td>
                <td><span className={`status-badge ${enquiry.statusClass}`}>{enquiry.status}</span></td>
                <td>
                  <div className="table-actions">
                    <button className="btn-outline">Record Response</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
