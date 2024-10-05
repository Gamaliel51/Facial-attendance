import React from "react";
import Modal from "@mui/material/Modal";
import Spinner from "../spinner/Spinner";

// Define props types for FormModal
interface FormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  registerStudent?: string;
  loading?: boolean;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  closeModal,
  registerStudent,
  loading,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      className="flex justify-center items-center p-4"
    >
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        {loading ? (
          <Spinner size="2rem" color="#894a8b" />
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold">Registration Link</h2>
            <p className="mt-4 text-gray-600">{registerStudent}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${registerStudent}`);
                closeModal();
              }}
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FormModal;
/**
  * 
  *  <tbody className="block md:table-row-group">
                {attendanceRecords.flatMap((record) =>
                  record.attendance.map((item) => {
                    globalCounter++;
                    return (
                      <tr
                        key={`${item.matric}-${globalCounter}`}
                        className="bg-white border-t md:border-none block md:table-row"
                      >
                        <td className="block md:table-cell p-2 text-center">{globalCounter}</td>
                        <td className="block md:table-cell p-2 text-center">{item.matric}</td>
                        <td className="block md:table-cell p-2 text-center">{item.name}</td>
                        <td className="block md:table-cell p-2 text-center">{item.level}</td>
                        <td className="block md:table-cell p-2 text-center">{item.department}</td>
                        <td className="block md:table-cell p-2 text-center">{item.time}</td>
                        <td className="block md:table-cell p-2 text-center">{record.date}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
  */
