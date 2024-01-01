import React, { useEffect, useState } from 'react';
import Notiflix from 'notiflix';

import { Dropdown, Table } from 'react-bootstrap';
import dot from '../../../assets/images/dot-icon.svg';
import visa from '../../../assets/images/visa-card.svg';
import master from '../../../assets/images/master-card.svg';
import paypal from '../../../assets/images/paypal-card.svg';
import applepay from '../../../assets/images/applepay-card.svg';
import down from '../../../assets/images/down-icon.svg';
import { apiRequests } from '../../../Common/apiRequests';
import './Billing.scss';

function Billing() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    listInvoices();
  }, [])

  const listInvoices = async () => {
    const endPoint = `user/invoices`;
    const response = await apiRequests(endPoint, 'get');
    try {
      if (response.status === 200) {
        console.log('response', response)
        setInvoices(response.data.data);
      }
    } catch (err) {
      Notiflix.Notify.failure(err.response.data.status.message)
    }
  }

  return (
    <div className="custom-container">
      <div className="billing-page settings">
        <div className="outer">
          <div className="billing-heading d-flex justify-content-between align-items-center">
            <div className="fw-semibold">Payment Methods</div>
            <div className="dot-dropdown">
              <Dropdown>
                <Dropdown.Toggle variant="dot" id="dropdown-basic">
                  <img src={dot} alt="dot" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <div className="cards-bar">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-content-center">
                <div><img src={visa} alt="Visa" className="me-2" /></div>
                <div className="d-flex flex-column ps-1">
                  <div className="fw-small fw-semibold">Visa ending in 1234</div>
                  <div className="fw-small-xs gray85">Expire 06/2032</div>
                </div>
              </div>
              <div className="available status d-flex align-items-center fw-small fw-semibold">
                <span></span>available
              </div>
            </div>
          </div>
          <div className="cards-bar">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-content-center">
                <div><img src={master} alt="Master" className="me-2" /></div>
                <div className="d-flex flex-column ps-1">
                  <div className="fw-small fw-semibold">Mastercard ending in 4321</div>
                  <div className="fw-small-xs gray85">Expire 24/2021</div>
                </div>
              </div>
              <div className="expired status d-flex align-items-center fw-small fw-semibold">
                <span></span>expired
              </div>
            </div>
          </div>
          <div className="cards-bar">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-content-center">
                <div><img src={paypal} alt="Paypal" className="me-2" /></div>
                <div className="d-flex flex-column ps-1">
                  <div className="fw-small fw-semibold">PayPal</div>
                  <div className="fw-small-xs gray85">Expire 06/2028</div>
                </div>
              </div>
              <div className="available status d-flex align-items-center fw-small fw-semibold">
                <span></span>online
              </div>
            </div>
          </div>
          <div className="cards-bar">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-content-center">
                <div><img src={paypal} alt="Paypal" className="me-2" /></div>
                <div className="d-flex flex-column ps-1">
                  <div className="fw-small fw-semibold">PayPal</div>
                  <div className="fw-small-xs gray85">Expire 06/2028</div>
                </div>
              </div>
              <div className="available status d-flex align-items-center fw-small fw-semibold">
                <span></span>online
              </div>
            </div>
          </div>
          <div className="cards-bar">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-content-center">
                <div><img src={applepay} alt="Paypal" className="me-2" /></div>
                <div className="d-flex flex-column ps-1">
                  <div className="fw-small fw-semibold">Apple Pay</div>
                </div>
              </div>
              <div className="expired status d-flex align-items-center fw-small fw-semibold">
                <span></span>offline
              </div>
            </div>
          </div>
        </div>

        <div className="billing-outer overflow-hidden ">
          <div className="billing-heading d-flex justify-content-between align-items-center">
            <div className="fw-semibold">Invoices</div>
          </div>
          <Table responsive className="text-nowrap">
            <thead>
              <tr role='row'>
                <th>Invoice ID</th>
                <th>Date <img src={down} alt="down" /></th>
                <th>Amount <img src={down} alt="down" /></th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody role='rowgroup'>
              {invoices.map((invoice, index) => (
                <tr role='row' key={index}>
                  <td>{invoice.attributes.stripe_invoice_id}</td>
                  <td>{invoice.attributes.created}</td>
                  <td>${invoice.attributes.total}</td>
                  <td>
                    {invoice.attributes.status === 'paid' && <div className="available status d-inline-flex align-items-center fw-small fw-semibold">
                      <span></span>Paid
                    </div>}
                    {invoice.attributes.status === 'pending' && <div className="pending status d-inline-flex align-items-center fw-small fw-semibold">
                    <span></span>Pending
                  </div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Billing;
