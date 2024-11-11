import axios from "@/app/axios";
import { useBalance} from "wagmi";
export const updatePoint = async (id:any) => {
  try {
    const response = await axios.post(
      `https://tongym-be-ekfd.onrender.com/point`,
      {
        user: id,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update point", error);
    throw error;
  }
};
export const updateEnergy = async (id:any) => {
  try {
    const response = await axios.post(
      `https://tongym-be-ekfd.onrender.com/energy`,
      {
        user: id,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update energy", error);
    throw error;
  }
};
export const updateItem = async (id: any, mount: number, balance: number) => {
  try {
    const response = await axios.put(
      `https://tongym-be-ekfd.onrender.com/users`,
      {
        user: id,
        mount: mount,
        balance: balance,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update item", error);
    throw error;
  }
};
export const updateODP = async (id: any, mount: number) => {
  try {
    const response = await axios.post(
      `https://tongym-be-ekfd.onrender.com/odp`,
      {
        user: id,
        amount: mount,
        
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update item", error);
    throw error;
  }
};
export const updateRate = async (title: string, ocicat: number, otp: number, odp: number) => {
  try {
    const response = await axios.post(
      `https://tongym-be-ekfd.onrender.com/rate`,
      {
        title: title,
        ocicat: ocicat,
        otp: otp,
        odp: odp
        
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update item", error);
    throw error;
  }
};
export const updateReward = async (id: any, amount: number) => {
  try {
    const response = await axios.post(
      `https://tongym-be-ekfd.onrender.com/upreward`,
      {
        user: id,
        upreward: amount,
        
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update item", error);
    throw error;
  }
};
export const getUserDataByTgid = async (id: any) => {
  try {
    const response = await axios.post(
      `https://tongym-be-ekfd.onrender.com/tgid`,
      {
        user: id,
        
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update item", error);
    throw error;
  }
};
export const getItem = async (id: string) => {
  try {
    const response = await axios.get(
      `https://tongym-be-ekfd.onrender.com/users/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get item", error);
    throw error;
  }
};
