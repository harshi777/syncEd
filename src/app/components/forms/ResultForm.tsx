/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createResult, updateResult } from "@/lib/actions";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";

const ResultForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any; // { students, exams, assignments }
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema) as any,
  });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    { success: false, error: false },
  );
  const router = useRouter();

  const onSubmit = handleSubmit((formData) => formAction(formData as any));

  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  const students = relatedData?.students || [];
  const exams = relatedData?.exams || [];
  const assignments = relatedData?.assignments || [];

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Result" : "Update Result"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Student</label>
          <select
            {...register("studentId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.studentId ?? ""}
          >
            <option value="">Select student</option>
            {students.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.surname}
              </option>
            ))}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Score"
          name="score"
          type="number"
          register={register}
          defaultValue={data?.score}
          error={errors?.score}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Exam (optional)</label>
          <select
            {...register("examId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.examId ?? ""}
          >
            <option value="">Select exam</option>
            {exams.map((e: any) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Assignment (optional)</label>
          <select
            {...register("assignmentId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.assignmentId ?? ""}
          >
            <option value="">Select assignment</option>
            {assignments.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
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

export default ResultForm;
