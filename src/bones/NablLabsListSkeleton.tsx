"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function NablLabsListSkeleton() {
  return (
    <BoneyardSkeleton
      name="nabl-labs-list"
      loading={true}
      fallback={
        <div className="nabl-table-scroll">
          <table className="nabl-table">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>ODOP Category</th>
                <th>CAB ID</th>
                <th>Laboratory Name</th>
                <th>Address</th>
                <th>District</th>
                <th>Discipline</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td style={{ textAlign: "center" }}>
                    <div className="skeleton-line" style={{ width: "20px", height: "14px", margin: "auto" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "100px", height: "14px" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "60px", height: "14px" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "150px", height: "14px" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "180px", height: "14px" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "90px", height: "14px" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "120px", height: "14px" }}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    >
      <div />
    </BoneyardSkeleton>
  );
}
