import React from "react";
import { BsDash, BsPlus } from "react-icons/bs";

const QuantityUpdater = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center">
      <button
        onClick={onDecrease}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
      >
        <BsDash />
      </button>

      <input
        name="quantity"
        type="number"
        value={quantity}
        readOnly
        className="w-16 h-10 mx-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-[#537D5D]"
      />

      <button
        onClick={onIncrease}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
      >
        <BsPlus />
      </button>
    </div>
  );
};

export default QuantityUpdater;
