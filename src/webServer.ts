import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response, Router } from "express";
import http, { Server } from "http";

import { ProcessService } from "./lib/processService";

type WebServerConfig = {
  port: number;
  allowedOrigins: string[];
};

export class WebServer {
  private express: express.Express;
  private server: Server | undefined;
  private started = false;

  constructor(private config: WebServerConfig, private routers: Router[]) {
    this.express = this.createExpress();
    this.server = http.createServer(this.express);
    this.configureExpress(config);
    this.setupRoutes();
  }

  private createExpress() {
    return express();
  }

  private configureExpress(config: WebServerConfig) {
    // Handle preflight requests first
    this.express.options('*', cors<Request>({
        origin: config.allowedOrigins,
        credentials: true,
        optionsSuccessStatus: 200
    }));

    // Then apply CORS middleware for all other requests
    this.express.use(cors<Request>({
        origin: (origin: string | undefined, callback) => {
            if (!origin) return callback(null, true);
            
            if (config.allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log('CORS blocked for origin:', origin);
                callback(new Error('Not allowed by CORS'), false);
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        optionsSuccessStatus: 200,
    }));

    this.express.use((req: Request, res: Response, next: NextFunction) => {
        // Always set these headers for allowed origins
        const origin = req.headers.origin as string;
        if (origin && config.allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Origin', origin);
        }
        next();
    });

    this.express.use(express.json());
    this.express.use(cookieParser());
}

  private setupRoutes() {
    this.routers.forEach((router) => {
      this.express.use(router);
    });
  }

  getHttp() {
    if (!this.server) throw new Error("Server not yet started");
    return this.server;
  }

  async start(): Promise<void> {
    return new Promise((resolve, _reject) => {
      ProcessService.killProcessOnPort(this.config.port, () => {

        this.server.listen(this.config.port, () => {
          console.log(`Server is running on port ${this.config.port}`);
          this.started = true;
          resolve();
        });
      });
    });
  }

  isStarted() {
    return this.started;
  }

  async stop(): Promise<void> {
    return new Promise((resolve, _reject) => {
      if (this.server) {
        this.server.close(() => {
          this.started = false;
          resolve();
        });
      }
    });
  }
}