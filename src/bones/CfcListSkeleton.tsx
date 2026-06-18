"use client";

import BoneyardSkeleton from "@/bones/BoneyardSkeleton";

export default function CfcListSkeleton() {
  return (
    <BoneyardSkeleton
      name="cfc-list"
      loading={true}
      fallback={
        <div className="cfc-table-scroll">
          <table className="cfc-table cfc-master-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>District</th>
                <th>Product</th>
                <th>SPV Name</th>
                <th>Address</th>
                <th>Intervention</th>
                <th>Contact</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td style={{ textAlign: "center" }}>
                    <div className="skeleton-line" style={{ width: "20px", height: "14px", margin: "auto" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "80px", height: "14px" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "100px", height: "14px" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "120px", height: "14px" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "150px", height: "14px" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "130px", height: "14px" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "90px", height: "14px" }}></div>
                  </td>
                  <td>
                    <div className="skeleton-line" style={{ width: "70px", height: "14px" }}></div>
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
