import React from "react";
import styled from "styled-components";

export const AdminModal = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [reservations, setReservations] = React.useState(null);
  const [seats, setSeats] = React.useState(null);
  const [seatSelected, setSeatSelected] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/reservations")
      .then((res) => res.json())
      .then((data) => setReservations(data.data));

    fetch("/api/seat-availability")
      .then((res) => res.json())
      .then((data) => setSeats(data.bookedSeats));
  }, []);

  return (
    <>
      {isModalOpen && (
        <Modal>
          <h1>Admin</h1>
          {reservations && <h2>Bookings</h2>}
          {reservations &&
            reservations.map((item) => {
              return (
                <div style={{ padding: "15px", textAlign: "center" }}>
                  <p>
                    <span>ID: </span>
                    {item._id}
                  </p>
                  <p>
                    <span>Name: </span>
                    {item.fullName}
                  </p>
                  <p>
                    <span>Email: </span>
                    {item.email}
                  </p>
                  <p>
                    <span>Creditcard Number: </span>
                    {item.creditCard}
                  </p>
                  <p>
                    <span>Expiration: </span>
                    {item.expiration}
                  </p>
                  <p>
                    <span>Seat ID: </span>
                    {item.seatId}
                  </p>
                </div>
              );
            })}

          {seats && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetch(`/api/delete/${seatSelected}`, {
                  method: "DELETE",
                });
              }}
            >
              <h2>Remove booking</h2>
              <label htmlFor="seatId">Seat ID:</label>
              <select
                name="seatId"
                id="seatId"
                onChange={(e) => setSeatSelected(e.target.value)}
              >
                {seats.map((id) => {
                  return <option value={id._id}>{id._id}</option>;
                })}
              </select>
              <button type="submit">Delete</button>
            </form>
          )}
        </Modal>
      )}
      <ModalButton onClick={() => setIsModalOpen(!isModalOpen)}>
        Admin
      </ModalButton>
    </>
  );
};

const ModalButton = styled.button`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 25px;
  cursor: pointer;
`;

const Modal = styled.div`
  background: #fff;
  color: #000;
  height: 600px;
  width: 800px;
  overflow: auto;
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
