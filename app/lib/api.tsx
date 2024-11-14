import instance from "@/app/axios";

export const updatePoint = async (id: any) => {
  try {
    const response = await instance.post(`/point`, {
      user: id,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update point", error);
    throw error;
  }
};
export const updateEnergy = async (id: any) => {
  try {
    const response = await instance.post(`/energy`, {
      user: id,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update energy", error);
    throw error;
  }
};
export const updateItem = async (id: any, mount: number, balance: number) => {
  try {
    const response = await instance.put(`/users`, {
      user: id,
      mount: mount,
      balance: balance,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update item", error);
    throw error;
  }
};
export const updateODP = async (id: any, mount: number) => {
  try {
    const response = await instance.post(`/odp`, {
      user: id,
      amount: mount,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update item", error);
    throw error;
  }
};
export const updateRate = async (
  title: string,
  ocicat: number,
  otp: number,
  odp: number
) => {
  try {
    const response = await instance.post(`/rate`, {
      title: title,
      ocicat: ocicat,
      otp: otp,
      odp: odp,
    });
    const response2 = await instance.post(`/limit`, {
      limit: ocicat,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update item", error);
    throw error;
  }
};
export const updateReward = async (id: any, amount: number) => {
  try {
    const response = await instance.post(`/upreward`, {
      user: id,
      upreward: amount,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update item", error);
    throw error;
  }
};
export const getUserDataByTgid = async (id: any) => {
  try {
    const response = await instance.post(`/tgid`, {
      user: id,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update item", error);
    throw error;
  }
};
export const getItem = async (id: string) => {
  try {
    const response = await instance.get(`/${id}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get item", error);
    throw error;
  }
};
