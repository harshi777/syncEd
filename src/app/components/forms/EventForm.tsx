/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { EventSchema, eventSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { createEvent, updateEvent } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const EventForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema) as any,
  });

  const [state, formAction] = useFormState(
    type === "create" ? createEvent : updateEvent,
    { success: false, error: false },
  );

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Event has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  const { classes } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Event" : "Update Event"}
      </h1>

      <div className="flex flex-wrap justify-between gap-4">
        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />

        <InputField
          label="Description"
          name="description"
          type="text"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />

        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          defaultValue={
            data?.startTime
              ? new Date(data?.startTime).toISOString().slice(0, 16)
              : ""
          }
          register={register}
          error={errors?.startTime}
        />

        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          defaultValue={
            data?.endTime
              ? new Date(data?.endTime).toISOString().slice(0, 16)
              : ""
          }
          register={register}
          error={errors?.endTime}
        />

        {/* Optional Class Select */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class (Optional)</label>
          <select
            {...register("classId")}
            defaultValue={data?.classId || ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="">Select Class</option>
            {classes?.map((cls: any) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Only in Update */}
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            hidden
          />
        )}
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong :(</span>
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default EventForm;
