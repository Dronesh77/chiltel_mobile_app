import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface Service {
  _id: string;
  serviceId: {
    name: string;
    description: string;
    price: number;
    estimatedDuration: string;
  };
  count: number;
}

interface ServiceItem {
  _id: string;
  services: Service[];
  price: number;
  scheduledFor: string;
  status: string;
  paymentStatus: string;
  workStarted?: boolean;
  remarks?: string;
  user?: {
    name: string;
  };
  userLocation?: {
    address: string;
  };
  OTP?: string;
}

interface ServiceCartViewProps {
  serviceCart: ServiceItem[];
  setShowCancelModal: (show: boolean) => void;
  setSelectedServiceId: (id: string) => void;
  handlePaymentModal: (service: ServiceItem) => void;
}

const ServiceCartView: React.FC<ServiceCartViewProps> = ({
  serviceCart,
  setShowCancelModal,
  setSelectedServiceId,
  handlePaymentModal,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [view, setView] = useState("services");

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <>
      {/* Services Section */}
      {view === "services" && (
        <>
          {/* Services Table Headers */}
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center border-b pb-2 text-gray-600 text-sm font-medium">
            <div>Service Request</div>
            <div>Services</div>
            <div>Total Price</div>
            <div>Status</div>
            <div>Payment Status</div>
          </div>

          {/* Service Items */}
          <div>
            {serviceCart?.map((serviceItem) => {
              if (
                serviceItem.status === "CANCELLED" ||
                serviceItem.status === "COMPLETED"
              )
                return null;

              return (
                <div
                  key={serviceItem._id}
                  className={`py-4 border-b text-gray-700 grid grid-cols-[2fr_2fr_1fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center gap-4 ${
                    serviceItem.status === "REQUESTED"
                      ? "border-yellow-500 bg-yellow-50"
                      : ""
                  }`}
                >
                  {/* Service Request ID / Scheduled Date */}
                  <div>
                    <p className="text-xs sm:text-base font-medium">
                      Scheduled:{" "}
                      {new Date(serviceItem.scheduledFor).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(serviceItem.scheduledFor).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Services List */}
                  <div>
                    <ul className="text-sm space-y-1">
                      {serviceItem.services.map((service, idx) => (
                        <li key={idx}>
                          {service.serviceId.name}{" "}
                          {service.count > 1 ? `(×${service.count})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Total Price */}
                  <div>
                    <p className="font-medium">Rs {serviceItem.price}</p>
                    <p className="text-xs text-gray-500">+ 18% GST</p>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded ${
                        serviceItem.status === "REQUESTED"
                          ? "bg-yellow-100 text-yellow-700"
                          : serviceItem.status === "CREATED"
                          ? "bg-gray-200 text-gray-700"
                          : serviceItem.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700"
                          : serviceItem.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : serviceItem.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : ""
                      }`}
                    >
                      {serviceItem.workStarted &&
                      serviceItem.status == "ASSIGNED"
                        ? "RIDER ON THE WAY"
                        : serviceItem.status}
                    </span>
                  </div>

                  {/* Payment Status */}
                  <div>
                    {serviceItem.status === "REQUESTED" ? (
                      <button
                        onClick={() => handlePaymentModal(serviceItem)}
                        className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span
                        className={`px-2 py-1 text-sm font-medium rounded ${
                          serviceItem.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : serviceItem.paymentStatus === "REFUNDED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {serviceItem.paymentStatus}
                      </span>
                    )}
                  </div>

                  {/* More Options Button */}
                  <div className="relative col-span-5 mt-2">
                    <button
                      onClick={() => toggleRow(serviceItem._id)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border rounded-md hover:bg-gray-200 focus:outline-none"
                    >
                      {expandedRow === serviceItem._id
                        ? "Less Details"
                        : "More Details"}
                      {expandedRow === serviceItem._id ? (
                        <Ionicons name="chevron-up" size={24} color="#6B7280" />
                      ) : (
                        <Ionicons name="chevron-down" size={24} color="#6B7280" />
                      )}
                    </button>

                    {/* Expanded Details */}
                    {expandedRow === serviceItem._id && (
                      <div className="absolute mt-2 z-10 w-full p-4 text-sm bg-white border rounded-lg shadow-md">
                        <div className="mb-4">
                          <h3 className="font-semibold text-lg mb-2">
                            Service Details
                          </h3>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2">Service</th>
                                  <th className="text-left py-2">
                                    Description
                                  </th>
                                  <th className="text-left py-2">Duration</th>
                                  <th className="text-right py-2">Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {serviceItem.services.map((service, idx) => (
                                  <tr key={idx} className="border-b">
                                    <td className="py-2">
                                      {service.serviceId.name}{" "}
                                      {service.count > 1
                                        ? `(×${service.count})`
                                        : ""}
                                    </td>
                                    <td className="py-2">
                                      {service.serviceId.description}
                                    </td>
                                    <td className="py-2">
                                      {service.serviceId.estimatedDuration}
                                    </td>
                                    <td className="py-2 text-right">
                                      Rs{" "}
                                      {service.serviceId.price * service.count}
                                    </td>
                                  </tr>
                                ))}
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="py-2 text-right font-medium"
                                  >
                                    Base Price:
                                  </td>
                                  <td className="py-2 text-right font-medium">
                                    Rs {serviceItem.price}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="py-2 text-right font-medium"
                                  >
                                    GST (18%):
                                  </td>
                                  <td className="py-2 text-right font-medium">
                                    Rs {Math.round(serviceItem.price * 0.18)}
                                  </td>
                                </tr>
                                <tr className="border-t">
                                  <td
                                    colSpan={3}
                                    className="py-2 text-right font-medium"
                                  >
                                    Total:
                                  </td>
                                  <td className="py-2 text-right font-medium">
                                    Rs {Math.round(serviceItem.price * 1.18)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Status */}
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">
                              Status
                            </span>
                            <span
                              className={`px-2 py-1 mt-1 text-sm font-medium text-center rounded-md ${
                                serviceItem.status === "CREATED"
                                  ? "bg-gray-200 text-gray-700"
                                  : serviceItem.status === "IN_PROGRESS"
                                  ? "bg-blue-100 text-blue-700"
                                  : serviceItem.status === "COMPLETED"
                                  ? "bg-green-100 text-green-700"
                                  : serviceItem.status === "CANCELLED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {serviceItem.workStarted &&
                              serviceItem.status == "ASSIGNED"
                                ? "RIDER ON THE WAY"
                                : serviceItem.status}
                            </span>
                          </div>

                          {/* Payment Status */}
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">
                              Payment Status
                            </span>
                            <span
                              className={`px-2 py-1 mt-1 text-sm font-medium text-center rounded-md ${
                                serviceItem.paymentStatus === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : serviceItem.paymentStatus === "PAID"
                                  ? "bg-green-100 text-green-700"
                                  : serviceItem.paymentStatus === "REFUNDED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {serviceItem.paymentStatus}
                            </span>
                          </div>

                          {/* Remarks */}
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">
                              Remarks
                            </span>
                            <span className="text-gray-600">
                              {serviceItem.remarks}
                            </span>
                          </div>

                          {/* User Information */}
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">
                              Customer
                            </span>
                            <span className="text-gray-600">
                              {serviceItem.user?.name || 'N/A'}
                            </span>
                          </div>

                          {/* Happy Code - if exists */}
                          {serviceItem.OTP && (
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-700">
                                Happy Code:
                              </span>
                              <span className="text-gray-600">
                                {serviceItem.OTP}
                              </span>
                            </div>
                          )}

                          {/* Location */}
                          <div className="flex flex-col col-span-2">
                            <span className="font-semibold text-gray-700">
                              Service Location
                            </span>
                            <span className="text-gray-600">
                              {serviceItem.userLocation?.address}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-col gap-2">
                          {serviceItem.status === "CREATED" ||
                          (serviceItem.status == "ASSIGNED" &&
                            !serviceItem.workStarted) ? (
                            <button
                              onClick={() => {
                                setSelectedServiceId(serviceItem._id);
                                setShowCancelModal(true);
                              }}
                              className="w-full px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                            >
                              Cancel Service
                            </button>
                          ) : null}
                          {serviceItem.status === "REQUESTED" && (
                            <button
                              onClick={() => handlePaymentModal(serviceItem)}
                              className="w-full px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default ServiceCartView;