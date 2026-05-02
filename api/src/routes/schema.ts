import z from 'zod';

export const AuthBody = z.object({
  body: z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const paginationQuery = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => Math.max(1, Number(val) || 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => Math.max(1, Math.min(100, Number(val) || 10))),
  }),
});

export const idParam = z.object({
  params: z.object({ id: z.uuid('Invalid ID format') }),
});

export const addressBody = z.object({
  body: z.object({
    address: z.string().min(1, 'Address is required'),
  }),
});

export const roomBody = z.object({
  body: z.object({
    roomNumber: z.string().min(1, 'Room number is required'),
    rentalPrice: z.number().positive('Rental price must be positive'),
  }),
});

export const houseIdParam = z.object({
  params: z.object({
    houseId: z.uuid('Invalid House ID format'),
  }),
});

export const leaseBody = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID'),
    roomId: z.string().uuid('Invalid room ID'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
  }),
});

export const leaseUpdateBody = z.object({
  body: z.object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
  }),
});
