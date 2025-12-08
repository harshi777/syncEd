/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createAssignment, updateAssignment } from "@/lib/actions";
import {
  assignmentSchema,
  AssignmentSchema,
} from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";

const AssignmentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any; // { lessons }
}) => {
  const formatDateTimeLocal = (
    isoString: string | undefined,
  ): string | undefined => {
    if (!isoString) return undefined;

    // Create a Date object from the ISO string
    const date = new Date(isoString);

    // Format to YYYY-MM-DD
    const datePart = date.toISOString().slice(0, 10);

    // Format to hh:mm
    const timePart = date.toTimeString().slice(0, 5);

    return `${datePart}T${timePart}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema) as any,
    defaultValues: {
      ...data,
      startDate: new Date(data.startDate).toISOString().slice(0, 10),
      dueDate: new Date(data.dueDate).toISOString().slice(0, 10),
    },
  });
  const [selectedLesson, setSelectedLesson] = useState(data?.lessonId);

  const [state, formAction] = useFormState(
    type === "create" ? createAssignment : updateAssignment,
    { success: false, error: false },
  );

  const router = useRouter();

  const onSubmit = handleSubmit((formData) => {
    formAction(formData as any);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Assignment has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  const { lessons } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Assignment" : "Update Assignment"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Title"
          name="title"
          register={register}
          defaultValue={data?.title}
          error={errors?.title}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Start Date</label>
          <input
            {...register("startDate")}
            type="date"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
          {errors.startDate?.message && (
            <p className="text-xs text-red-400">
              {errors.startDate.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Due Date</label>
          <input
            {...register("dueDate")}
            type="date"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
          {errors.dueDate?.message && (
            <p className="text-xs text-red-400">
              {errors.dueDate.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            {...register("lessonId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            value={selectedLesson}
            defaultValue={data?.lessonId}
            onChange={(e) => setSelectedLesson(e.target.value)}
          >
            {lessons.map((l: { id: number; name: string }) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>

        {data && (
          <input type="hidden" {...register("id")} defaultValue={data?.id} />
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

export default AssignmentForm;
