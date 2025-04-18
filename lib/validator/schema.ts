import z from "zod";

const jobSheduleSchema = z.enum(
  [
    "Nine-to-five",
    "Morning shift",
    "Day shift",
    "Evening shift",
    "Night shift",
  ],
  {
    errorMap: () => ({ message: "Error: Select a valid job schedule." }),
  }
);

const detailsSchema = z.object({
  name: z.string().nonempty("Error: Enter a valid name."),
  email: z
    .string()
    .nonempty("Error: Enter a valid email.")
    .email("Invalid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Error: Invalid email address."
    ),
  phone: z
    .string()
    .nonempty("Error: Enter a valid phone number.")
    .regex(/^\d{11}$/, "Error: Phone number must be 11 digits long."),
  jobTitle: z.string().nonempty("Error: Enter a valid job title."),
  jobShedule: jobSheduleSchema,
});

type DetailsInfo = z.infer<typeof detailsSchema>;

const DefaultDetailsInfo: DetailsInfo = {
  name: "",
  email: "",
  phone: "",
  jobTitle: "",
  jobShedule: "Morning shift",
};

export { DefaultDetailsInfo, detailsSchema, type DetailsInfo };

const cvSchema = z.object({
  // only one pdf file allowed
  cv: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "Error: CV is required.",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Error: CV must be less than 10MB.",
    })
    .refine((file) => file.name.endsWith(".pdf"), {
      message: "Error: CV must be a PDF file.",
    }),
  coverLetter: z
    .string()
    .nonempty("Error: Enter a valid cover letter.")
    .min(20, "Error: Cover letter must be at least 20 characters long.")
    .max(5000, "Error: Cover letter must be at most 5000 characters long."),
});

type CvInfo = z.infer<typeof cvSchema>;

const DefaultCvInfo: CvInfo = {
  cv: new File([], ""),
  coverLetter: "",
};

export { cvSchema, DefaultCvInfo, type CvInfo };
