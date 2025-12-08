/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LessonSchema, lessonSchema } from "@/lib/formValidationSchemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";
import { createLesson, updateLesson } from "@/lib/actions";

const LessonForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any; // contains teachers, classes, subjects
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
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema) as any,
    defaultValues: {
      ...data,
      startTime: formatDateTimeLocal(data?.startTime),
      endTime: formatDateTimeLocal(data?.endTime),
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createLesson : updateLesson,
    { success: false, error: false },
  );

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
    formAction({ ...formData });
  });

  const router = useRouter();
  const { subjects, classes, teachers } = relatedData;

  useEffect(() => {
    if (state.success) {
      toast(`Lesson has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Lesson" : "Update Lesson"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Lesson Name"
          name="name"
          register={register}
          defaultValue={data?.name}
          error={errors?.name}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            {...register("day")}
            defaultValue={data?.day}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
          </select>
          {errors.day?.message && (
            <p className="text-xs text-red-400">
              {errors.day.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          register={register}
          defaultValue={formatDateTimeLocal(data?.startTime)}
          error={errors?.startTime}
        />

        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          register={register}
          defaultValue={formatDateTimeLocal(data?.endTime)}
          error={errors?.endTime}
        />

        {/* Subject Dropdown */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            {...register("subjectId")}
            defaultValue={data?.subjectId}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            {subjects.map((sub: { id: number; name: string }) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">
              {errors.subjectId.message.toString()}
            </p>
          )}
        </div>

        {/* Class Dropdown */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            {...register("classId")}
            defaultValue={data?.classId}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            {classes.map((cl: { id: number; name: string }) => (
              <option key={cl.id} value={cl.id}>
                {cl.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>

        {/* Teacher Dropdown */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            {...register("teacherId")}
            defaultValue={data?.teacherId}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            {teachers.map(
              (t: { id: string; name: string; surname: string }) => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.surname}
                </option>
              ),
            )}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherId.message.toString()}
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

export default LessonForm;
