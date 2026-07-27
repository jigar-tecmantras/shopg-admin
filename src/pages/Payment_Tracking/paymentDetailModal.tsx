/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable react/react-in-jsx-scope */
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React from 'react';

const PaymentDetailsModal = ({show, onHide, paymentId}: any): JSX.Element => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold fs-3">Payment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5 className="mb-2 fs-5">
            <span className="fw-semibold">Amount:</span> ₹
            {Number(
              paymentId?.payment_detail?.content?.order?.effective_amount,
            )}
          </h5>
          <h6 className="mb-2 fs-5">
            <span className="fw-semibold">Refunded:</span>
            {/* ₹ {paymentId?.payment_detail?.amount_refunded}  */}
            <span className="">
              {paymentId?.refund_id !== null ? ' Yes' : ' No'}
            </span>
          </h6>
          <p className="mb-1 fs-5">
            <span className="fw-semibold">Order Id:-</span>{' '}
            {paymentId?.juspay_order_id}
          </p>

          {/* If the method of payment is from card */}
          {paymentId?.payment_detail?.content?.order?.payment_method_type ===
            'CARD' && (
            <>
              <div className="mb-4 mt-4">
                <h5 className="mb-2 fs-5">
                  <u>
                    <span className="fw-semibold">Payment by Card</span>
                  </u>
                </h5>
                <p className="mb-1 fs-5">
                  <span className="fw-semibold">Card Fingerprint:-</span>{' '}
                  {
                    paymentId?.payment_detail?.content?.order?.card
                      ?.card_fingerprint
                  }
                </p>
                {/* <p className="mb-1 fs-5">
                  <span className="fw-semibold">EMI:-</span>{' '}
                  {paymentId?.payment_detail?.card?.emi === true ? 'Yes' : 'No'}
                </p> */}
                {/* <p className="mb-1 fs-5">
                  <span className="fw-semibold">Entity:-</span>{' '}
                  {paymentId?.payment_detail?.content?.order?.card?.token_type}
                </p> */}
                <p className="mb-1 fs-5">
                  <span className="fw-semibold">Last 4 Digits:-</span>{' '}
                  {
                    paymentId?.payment_detail?.content?.order?.card
                      ?.last_four_digits
                  }
                </p>
                <p className="mb-1 fs-5">
                  <span className="fw-semibold">Card Expiry Month:-</span>{' '}
                  {
                    paymentId?.payment_detail?.content?.order?.card
                      ?.expiry_month
                  }
                </p>
                <p className="mb-1 fs-5">
                  <span className="fw-semibold">Card Expiry Year:-</span>{' '}
                  {paymentId?.payment_detail?.content?.order?.card?.expiry_year}
                </p>
                <p className="mb-1 fs-5">
                  <span className="fw-semibold">Type of Card:-</span>{' '}
                  {
                    paymentId?.payment_detail?.content?.order?.card
                      ?.extended_card_type
                  }{' '}
                  CARD
                </p>
                <p className="mb-1 fs-5">
                  <span className="fw-semibold">Card Holder Name:-</span>{' '}
                  {
                    paymentId?.payment_detail?.content?.order?.card
                      ?.name_on_card
                  }
                </p>
                <p className="mb-1 fs-5">
                  <span className="fw-semibold">Card Brand:-</span>{' '}
                  {paymentId?.payment_detail?.content?.order?.card?.card_brand}
                </p>
                <p className="mb-1 fs-5">
                  <span className="fw-semibold">Card Issuer:-</span>{' '}
                  {paymentId?.payment_detail?.content?.order?.card?.card_issuer}
                </p>
              </div>
            </>
          )}

          {/* If the method of payment is from netbanking */}
          {paymentId?.payment_detail?.method === 'netbanking' && (
            <>
              <div className="mb-4 mt-4">
                <h5 className="mb-2 fs-5">
                  <u>
                    <span className="fw-semibold">Payment by Net Banking</span>
                  </u>
                </h5>
                <p className="mb-1 fs-5">
                  <span className="fw-semibold">Bank:-</span>{' '}
                  {paymentId?.payment_detail?.bank}
                </p>
                <p className="mb-1 fs-5">
                  <span className="fw-semibold">Bank Transaction Id:-</span>{' '}
                  {
                    paymentId?.payment_detail?.acquirer_data
                      ?.bank_transaction_id
                  }
                </p>
              </div>
            </>
          )}
          {/* If the payment method is wallet */}
          {paymentId?.payment_detail?.method === 'wallet' && (
            <>
              <div className="mb-4 mt-4">
                <h5 className="mb-2 fs-5">
                  <u>
                    <span className="fw-semibold">Payment by Wallet</span>
                  </u>
                </h5>
                <p className="mb-1 fs-5">
                  <span className="fw-semibold">Wallet:-</span>{' '}
                  {paymentId?.payment_detail?.wallet}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mb-4">
          <h6 className="mb-2 fs-5">
            <span className="fw-semibold">Contact:</span> +91
            {paymentId?.payment_detail?.content?.order?.customer_phone}
          </h6>
          <h6 className="mb-2 fs-5">
            <span className="fw-semibold">Email:</span>{' '}
            {paymentId?.payment_detail?.content?.order?.customer_email}
          </h6>
          {/* <h6 className="mb-2 fs-5">
            <span className="fw-semibold">Description:</span>{' '}
            {paymentId?.payment_detail?.content?.order?.customer_phone}
          </h6> */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default PaymentDetailsModal;
