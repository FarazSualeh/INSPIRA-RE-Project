import cors, { CorsOptions } from "cors";

const allowedOrigins = [
  "http://localhost:3000", // Frontend URL
  // Add any additional allowed origins here
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // allow cookies / authorization headers
};

// Optional: in case you want to use middleware directly
export const corsMiddleware = cors(corsOptions);
