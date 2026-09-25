"use client";

import { useState } from "react";
import Envelop from "@/feature/envelop/components/envenlop";

interface EnvelopeGateProps {
  children: React.ReactNode;
}

const EnvelopeGate: React.FC<EnvelopeGateProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return <Envelop setIsOpen={setIsOpen} />;
  }

  return children;
};

export default EnvelopeGate;
