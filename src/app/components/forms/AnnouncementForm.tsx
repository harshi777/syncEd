/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import {
  announcementSchema,
  AnnouncementSchema,
} from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";

const AnnouncementForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any; // { classes }
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema) as any,
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAnnouncement : updateAnnouncement,
    { success: false, error: false },
  );

  const router = useRouter();

  const onSubmit = handleSubmit((formData) => {
    formAction(formData as any);
  });

  useEffect(() => {
    if (state.success) {
      toast(
        `Announcement has been ${type === "create" ? "created" : "updated"}`,
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  const classes = relatedData?.classes || [];

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Announcement" : "Update Announcement"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Title"
          name="title"
          register={register}
          defaultValue={data?.title}
          error={errors?.title}
        />
        <InputField
          label="Description"
          name="description"
          register={register}
          defaultValue={data?.description}
          error={errors?.description}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Date</label>
          <input
            {...register("date")}
            type="date"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={
              data?.date ? new Date(data.date).toISOString().split("T")[0] : ""
            }
          />
          {errors.date?.message && (
            <p className="text-xs text-red-400">
              {errors.date.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class (optional)</label>
          <select
            {...register("classId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.classId ?? ""}
          >
            <option value="">School-wide</option>
            {classes.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>

        {data && (
          <input
            type="hidden"
            {...register("id")}
            defaultValue={String(data.id)}
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

export default AnnouncementForm;
