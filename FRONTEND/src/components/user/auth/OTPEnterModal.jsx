import React, { Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Toaster } from "react-hot-toast";
const OTPEnterModal = (
  {isOpen,
    closeModal,
    onSubmit,
    onResendOTP,
    otpMessage,
    otpErrMessage}
) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60); //1 min

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return ()=> clearInterval(timer)
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(otp.join(""));
    setOtp(["", "", "", "", "", ""])
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    //element enter at index matches this index updates otp else return previous value
    setOtp([...otp.map((data, idx) => (idx === index ? element.value : data))]);

    //automatically moves focus
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };
  const handleResendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(60); //RESET TIME TO 60SEC
    //trigger on resendotp logic
    onResendOTP();
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Toaster/>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Enter OTP
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Please enter the 6-digit OTP sent to your phone.
                  </p>
                </div>
                {otpMessage && (
                  <p className="mt-2 text-center text-sm text-green-600">
                    {otpMessage}
                  </p>
                )}

                {otpErrMessage && (
                  <p className="mt-2 text-center text-sm text-green-600">
                    {otpErrMessage}
                  </p>
                )}
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="flex justify-center space-x-2">
                    {otp.map((data, index) => {
                      return (
                        <input
                          className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
                          type="text"
                          name="otp"
                          maxLength="1"
                          key={index}
                          value={data}
                          onChange={(e) => handleChange(e.target, index)}
                          onfocus={(e) => e.target.select()}
                        />
                      );
                    })}
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                      Time Remaining:{" "}
                      <span className="font-medium">
                        {Math.floor(timeLeft % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    >
                      Verify OTP
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <button
                    onClick={handleResendOtp}
                    disabled={timeLeft > 0}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${
                      timeLeft > 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                  >
                    {timeLeft > 0 ? `Resend OTP n ${timeLeft}s ` : "Resend OTP"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OTPEnterModal;
