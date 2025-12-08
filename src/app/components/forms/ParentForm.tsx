/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createParent, updateParent } from "@/lib/actions";
import { parentSchema, ParentSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";

const ParentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any; // could contain students if needed
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema) as any,
  });

  const [state, formAction] = useFormState(
    type === "create" ? createParent : updateParent,
    { success: false, error: false },
  );
  const router = useRouter();

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Parent has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Parent" : "Update Parent"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          register={register}
          defaultValue={data?.username}
          error={errors?.username}
        />
        <InputField
          label="First Name"
          name="name"
          register={register}
          defaultValue={data?.name}
          error={errors?.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          register={register}
          defaultValue={data?.surname}
          error={errors?.surname}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          register={register}
          defaultValue={data?.email}
          error={errors?.email}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          defaultValue={data?.phone}
          error={errors?.phone}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          defaultValue={data?.address}
          error={errors?.address}
        />

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

export default ParentForm;
