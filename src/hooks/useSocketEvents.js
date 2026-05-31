import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../services/socket";
import { receiveDoctorApproval } from "../features/auth/authSlice";
import {
  receiveAppointmentUpdate,
  receivePaymentVerified,
} from "../features/appointments/appointmentsSlice";
import {
  receiveNewAppointment,
  receiveCancelledAppointment,
  receiveDoctorPaymentVerified,
} from "../features/doctors/doctorsSlice";
import {
  adminReceiveNewAppointment,
  adminReceiveAppointmentUpdate,
  adminReceiveNewPayment,
} from "../features/admin/adminSlice";

const useSocketEvents = (user, dispatch, addNotif) => {
  useEffect(() => {
    if (!user) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(user.id || user._id);
    const { role } = user;

    if (role === "patient") {
      socket.on("appointment:updated", ({ appointment, message }) => {
        dispatch(receiveAppointmentUpdate(appointment));
        addNotif("Appointment Update", message, "info");
      });

      socket.on("payment:verified", ({ appointmentId, status, message }) => {
        dispatch(receivePaymentVerified({ appointmentId, status }));
        addNotif("Payment Update", message, status === "Approved" ? "success" : "danger");
      });
    }

    if (role === "doctor") {
      socket.on("appointment:new", ({ appointment, message }) => {
        dispatch(receiveNewAppointment(appointment));
        addNotif("New Appointment", message, "success");
      });

      socket.on("appointment:cancelled", ({ appointment, message }) => {
        dispatch(receiveCancelledAppointment(appointment));
        addNotif("Appointment Cancelled", message, "warning");
      });

      socket.on("doctor:approved", ({ isApproved, message }) => {
        dispatch(receiveDoctorApproval({ isApproved }));
        addNotif(
          isApproved ? "Profile Approved" : "Profile Rejected",
          message,
          isApproved ? "success" : "danger"
        );
      });

      socket.on("payment:verified", ({ appointmentId, status, message }) => {
        dispatch(receiveDoctorPaymentVerified({ appointmentId, status }));
        addNotif("Payment Update", message, status === "Approved" ? "success" : "warning");
      });
    }

    if (role === "admin") {
      socket.on("appointment:new", ({ appointment, message }) => {
        dispatch(adminReceiveNewAppointment(appointment));
        addNotif("New Appointment", message, "info");
      });

      socket.on("appointment:updated", ({ appointment, message }) => {
        dispatch(adminReceiveAppointmentUpdate(appointment));
        addNotif("Appointment Updated", message, "info");
      });

      socket.on("appointment:cancelled", ({ appointment, message }) => {
        dispatch(adminReceiveAppointmentUpdate(appointment));
        addNotif("Appointment Cancelled", message, "warning");
      });

      socket.on("payment:new", ({ payment, message }) => {
        dispatch(adminReceiveNewPayment(payment));
        addNotif("New Payment", message, "warning");
      });
    }

    return () => {
      socket.off("appointment:new");
      socket.off("appointment:updated");
      socket.off("appointment:cancelled");
      socket.off("doctor:approved");
      socket.off("payment:new");
      socket.off("payment:verified");
    };
  }, [user, dispatch, addNotif]);
};

export default useSocketEvents;
