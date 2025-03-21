/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import {
  createTripFormSchema,
  loginFormSchema,
  registerFormSchema,
  updateTripFormSchema,
} from "./form-schema";
import { UserResponse } from "./types";
import { apiClient } from "./utils";
import Cookies from "js-cookie";

export async function login(
  values: z.infer<typeof loginFormSchema>
): Promise<UserResponse> {
  try {
    const result = await apiClient.post("/users/login", values);
    return result;
  } catch (error: any) {
    throw error;
  }
}

export async function register(
  values: z.infer<typeof registerFormSchema>
): Promise<UserResponse> {
  try {
    const result = await apiClient.post("/users", values);
    return result;
  } catch (error: any) {
    throw error;
  }
}

export async function getTrips(): Promise<any> {
  try {
    const result = await apiClient.get("/trips", {
      headers: {
        Authorization: Cookies.get("token"),
      },
    });
    return result;
  } catch (error: any) {
    throw error;
  }
}

export async function createTrip(
  values: z.infer<typeof createTripFormSchema>
): Promise<any> {
  try {
    const result = await apiClient.post("/trips", values, {
      headers: {
        Authorization: Cookies.get("token"),
      },
    });
    return result;
  } catch (error: any) {
    throw error;
  }
}

export async function updateTrip(
  values: z.infer<typeof updateTripFormSchema>
): Promise<any> {
  try {
    const result = await apiClient.put(`/trips/${values.id}`, values, {
      headers: {
        Authorization: Cookies.get("token"),
      },
    });
    return result;
  } catch (error: any) {
    throw error;
  }
}

export async function deleteTrip(id: number) {
  try {
    const result = await apiClient.delete(`/trips/${id}`, {
      headers: {
        Authorization: Cookies.get("token"),
      },
    });
    return result;
  } catch (error: any) {
    throw error;
  }
}
