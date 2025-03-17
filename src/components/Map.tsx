/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { Trip } from "@/lib/types";
import { createTrip, deleteTrip, getTrips, updateTrip } from "@/lib/api";
import { useMap } from "react-leaflet";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { useMapEvent } from "react-leaflet";
import { createTripFormSchema, updateTripFormSchema } from "@/lib/form-schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const markerIcon = new L.Icon({
  iconUrl: "/marker.png",
  iconSize: [36, 36],
});

function ZoomToMarker({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 15, { animate: true });
  }, [position, map]);

  return null;
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: L.LatLng) => void;
}) {
  useMapEvent("click", (e) => {
    onMapClick(e.latlng);
  });

  return null;
}

export default function Map() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<number | null>(null);

  const createForm = useForm<z.infer<typeof createTripFormSchema>>({
    resolver: zodResolver(createTripFormSchema),
    defaultValues: {
      title: "",
      description: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const updateForm = useForm<z.infer<typeof updateTripFormSchema>>({
    resolver: zodResolver(updateTripFormSchema),
    defaultValues: {
      id: 0,
      title: "",
      description: "",
      latitude: 0,
      longitude: 0,
    },
  });

  async function handleDelete(id: number) {
    try {
      await deleteTrip(id);
      await fetchTrips();
      toast.error(`Trip deleted successfully`);
    } catch (error: any) {
      console.error("Error delete trip:", error);
    }
  }

  async function handleCreate(values: z.infer<typeof createTripFormSchema>) {
    try {
      const response = await createTrip(values);
      toast.success(`Trip created successfully`);
      console.log("Create trip success:", response);
      fetchTrips();
      createForm.setValue("title", "");
      createForm.setValue("description", "");
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      ) {
        toast.error(error.response.data.errors?.message || "Invalid request");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  async function handleUpdate(values: z.infer<typeof updateTripFormSchema>) {
    try {
      const response = await updateTrip(values);
      toast.success(`Trip updated successfully`);
      console.log("update trip success:", response);
      fetchTrips();
      setIsUpdateDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      ) {
        toast.error(error.response.data.errors?.message || "Invalid request");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  async function fetchTrips() {
    try {
      const response = await getTrips();
      setTrips(response.data.data);
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
  }

  function handleMapClick(latlng: L.LatLng) {
    createForm.setValue("latitude", latlng.lat);
    createForm.setValue("longitude", latlng.lng);
    setIsCreateDialogOpen(true);
  }

  function handleUpdateClick(trip: Trip) {
    updateForm.setValue("id", trip.id);
    updateForm.setValue("title", trip.title);
    updateForm.setValue("description", trip.description);
    updateForm.setValue("latitude", trip.latitude);
    updateForm.setValue("longitude", trip.longitude);
    setIsUpdateDialogOpen(true);
  }

  useEffect(() => {
    if (Cookies.get("token") && Cookies.get("token") !== "error") fetchTrips();
  }, []);

  return (
    <div className="relative">
      <MapContainer
        center={[-8.65, 115.216667]}
        zoom={10}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedPosition && <ZoomToMarker position={selectedPosition} />}

        {trips.map((trip, index) => (
          <Marker
            key={index}
            position={[trip.latitude, trip.longitude]}
            icon={markerIcon}
            eventHandlers={{
              click: () => {
                setSelectedPosition([trip.latitude, trip.longitude]);
              },
            }}
          >
            <Popup>
              <div className="w-48 flex flex-col items-center text-center">
                <p className="text-lg font-semibold">{trip.title}</p>
                <p className="text-xs text-gray-600">{trip.description}</p>
                <div className="flex flex-row justify-between">
                  <Button
                    variant="destructive"
                    onClick={() => handleUpdateClick(trip)}
                    className="w-full md:w-auto mt-8 mx-2 bg-orange-400 cursor-pointer hover:bg-orange-400"
                  >
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setTripToDelete(trip.id);
                      setIsConfirmDialogOpen(true);
                    }}
                    className="w-full md:w-auto mt-8 mx-2 cursor-pointer"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapClickHandler onMapClick={handleMapClick} />
      </MapContainer>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full max-h-[90vh] overflow-auto z-[9999]"
          style={{
            position: "fixed",
            margin: "auto",
          }}
        >
          <DialogHeader>
            <DialogTitle>Add New Trip</DialogTitle>
            <DialogDescription>
              Fill in the details and click `Save` to add a new trip.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                {...createForm.register("title")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                {...createForm.register("description")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="latitude" className="text-right">
                Latitude
              </Label>
              <Input
                id="latitude"
                {...createForm.register("latitude")}
                className="col-span-3"
                readOnly
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longitude" className="text-right">
                Longitude
              </Label>
              <Input
                id="longitude"
                {...createForm.register("longitude")}
                className="col-span-3"
                readOnly
                disabled
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="cursor-pointer">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full max-h-[90vh] overflow-auto z-[9999]"
          style={{
            position: "fixed",
            margin: "auto",
          }}
        >
          <DialogHeader>
            <DialogTitle>Update Trip</DialogTitle>
            <DialogDescription>
              Update in the details and click `Update` to update a trip.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={updateForm.handleSubmit(handleUpdate)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                {...updateForm.register("title")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                {...updateForm.register("description")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="latitude" className="text-right">
                Latitude
              </Label>
              <Input
                id="latitude"
                {...updateForm.register("latitude")}
                className="col-span-3"
                readOnly
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longitude" className="text-right">
                Longitude
              </Label>
              <Input
                id="longitude"
                {...updateForm.register("longitude")}
                className="col-span-3"
                readOnly
                disabled
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="cursor-pointer">
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full max-h-[90vh] overflow-auto z-[9999]"
          style={{
            position: "fixed",
            margin: "auto",
          }}
        >
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trip? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={async () => {
                if (tripToDelete !== null) {
                  await handleDelete(tripToDelete);
                  setIsConfirmDialogOpen(false);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster position="bottom-center" richColors />
    </div>
  );
}
