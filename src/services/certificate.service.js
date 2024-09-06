import Certificate from "../models/certificateModel.js";
import Provider from "../models/providerModel.js";

const addCertificate = async (providerId, title, document) => {
  console.log("asdasdasd", providerId);

  const provider = await Provider.findById(providerId);
  if (!provider) {
    throw new Error("Provider not found");
  }

  const certificate = await Certificate.create({
    provider: providerId,
    title,
    document,
  });
  if (!provider.certificates) {
    provider.certificates = []; // Initialize certificates array if it's undefined
  }
  provider.certificates.push(certificate._id);
  await provider.save();

  return certificate;
};

const getCertificatesByProvider = async (providerId) => {
  const certificates = await Certificate.find({ provider: providerId });
  if (!certificates) {
    throw new Error(
      "No certificates found for this provider",
      httpStatus.NOT_FOUND
    );
  }
  return certificates;
};

const updateCertificate = async (certificateId, title, document) => {
  const certificate = await Certificate.findById(certificateId);
  if (!certificate) {
    throw new Error("Certificate not found", httpStatus.NOT_FOUND);
  }

  certificate.title = title;
  certificate.document = document;
  await certificate.save();

  return certificate;
};

const deleteCertificate = async (certificateId) => {
  const certificate = await Certificate.findByIdAndDelete(certificateId);
  if (!certificate) {
    throw new Error("Certificate not found", httpStatus.NOT_FOUND);
  }

  // Optionally, you can also remove the certificate from the provider's certificates array
  const provider = await Provider.findById(certificate.provider);
  if (provider) {
    provider.certificates.pull(certificateId);
    await provider.save();
  }

  return certificate;
};
export {
  addCertificate,
  getCertificatesByProvider,
  updateCertificate,
  deleteCertificate,
};
