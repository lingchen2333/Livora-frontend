import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const StockStatus = ({ inventory }) => {
  const getStockLevel = (inventory) => {
    if (inventory <= 0) return "out";
    if (inventory <= 5) return "low";
    if (inventory <= 10) return "medium";
    return "high";
  };

  const stockLevel = getStockLevel(inventory);

  const stockStyles = {
    out: {
      text: "Out of stock",
      icon: <FaTimesCircle className="text-red-500" />,
      bg: "bg-red-50",
      textColor: "text-red-700",
    },
    low: {
      text: "In stock",
      icon: <FaCheckCircle className="text-orange-500" />,
      bg: "bg-orange-50",
      textColor: "text-orange-700",
    },
    medium: {
      text: "In stock",
      icon: <FaCheckCircle className="text-yellow-500" />,
      bg: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
    high: {
      text: "In stock",
      icon: <FaCheckCircle className="text-green-500" />,
      bg: "bg-green-50",
      textColor: "text-green-700",
    },
  };

  const style = stockStyles[stockLevel];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${style.bg}`}
    >
      {style.icon}
      <span className={`text-sm font-medium ${style.textColor}`}>
        {inventory > 0 ? `${inventory} ${style.text}` : style.text}
      </span>
    </div>
  );
};

export default StockStatus;
