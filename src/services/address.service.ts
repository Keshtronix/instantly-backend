import AddressModel from "../models/address.model";
import { CreateAddressInput } from "../validators/address.validator";
import { NotFoundException } from "../utils/app-error"; 

export const createAddressService = async (
  userId: string,
  data: CreateAddressInput
) => {
  await AddressModel.updateMany(
    { userId, isDefault: true },
    { $set: { isDefault: false } }
  );

  const address = await AddressModel.create({
    ...data,
    userId,
    isDefault: true,
  });
  return address;
};

export const getUserAddressesService = async (userId: string) => {
  const addresses = await AddressModel.find({ userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });
  return { addresses };
};




// export const deleteUserAddress = async (userId: string, addressId: string) => {
//   const address = await AddressModel.findOneAndDelete({
//     _id: addressId,
//     userId, // matches the schema field
//   });

//   if (!address) {
//     throw new NotFoundException("Address not found");
//   }

//   return address;
// };


export const deleteUserAddress = async (userId: string, addressId: string) => {
  const address = await AddressModel.findOneAndDelete({
    _id: addressId,
    userId,
  });

  if (!address) {
    throw new NotFoundException("Address not found");
  }

  // If the deleted address was the default, promote the most recently
  // created remaining address to be the new default
  if (address.isDefault) {
    const nextDefault = await AddressModel.findOne({ userId }).sort({
      createdAt: -1,
    });

    if (nextDefault) {
      nextDefault.isDefault = true;
      await nextDefault.save();
    }
  }

  return address;
};