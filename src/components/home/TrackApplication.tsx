"use client";

import { useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import LoginModal from "@/components/ui/LoginModal";

export default function TrackApplication() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsLoginModalOpen(true)} className="quick-item">
        <div className="quick-icon"><FaListCheck /></div>
        <span className="quick-label">Track Application</span>
      </button>

      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
