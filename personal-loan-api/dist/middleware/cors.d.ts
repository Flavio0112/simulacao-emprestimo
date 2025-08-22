import cors from 'cors';
export declare const corsOptions: {
    origin: string[];
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
};
export declare const corsMiddleware: (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
//# sourceMappingURL=cors.d.ts.map