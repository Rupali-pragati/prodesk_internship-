module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/db/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
}
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */ const globalForMongoose = globalThis;
let cached = globalForMongoose.mongoose;
if (!cached) {
    cached = globalForMongoose.mongoose = {
        conn: null,
        promise: null
    };
}
async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = dbConnect;
}),
"[project]/src/db/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Base",
    ()=>Base,
    "Colorant",
    ()=>Colorant,
    "Formula",
    ()=>Formula
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
// Schema for Universal tinter catalog (colorants available on the dispensing machine).
const colorantSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    pigment: {
        type: String,
        required: true
    },
    maxMlPerLiter: {
        type: Number,
        required: true
    },
    sortOrder: {
        type: Number,
        required: true,
        default: 0
    }
});
// Schema for Base paint catalog.
const baseSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    maxLoadPct: {
        type: Number,
        required: true
    }
});
// Schema for individual colorant additions for a formula.
const formulaItemSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    colorantCode: {
        type: String,
        required: true
    },
    mlPerLiter: {
        type: Number,
        required: true
    }
});
// Schema for Saved mixing formulas.
const formulaSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    baseCode: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    isPreset: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    items: [
        formulaItemSchema
    ]
});
const Colorant = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Colorant || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Colorant", colorantSchema);
const Base = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Base || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Base", baseSchema);
const Formula = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Formula || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Formula", formulaSchema);
}),
"[project]/src/db/seed.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureSeed",
    ()=>ensureSeed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-route] (ecmascript)");
;
;
const COLORANT_SEED = [
    {
        code: "W-001",
        name: "Titanium White",
        pigment: "PW-6",
        maxMlPerLiter: 500,
        sortOrder: 1
    },
    {
        code: "Y-105",
        name: "Yellow Oxide",
        pigment: "PY-42",
        maxMlPerLiter: 400,
        sortOrder: 2
    },
    {
        code: "Y-210",
        name: "Azo Yellow",
        pigment: "PY-74",
        maxMlPerLiter: 300,
        sortOrder: 3
    },
    {
        code: "O-702",
        name: "Orange Azo",
        pigment: "PO-5",
        maxMlPerLiter: 300,
        sortOrder: 4
    },
    {
        code: "R-301",
        name: "Red Oxide",
        pigment: "PR-101",
        maxMlPerLiter: 400,
        sortOrder: 5
    },
    {
        code: "R-450",
        name: "Naphthol Red",
        pigment: "PR-112",
        maxMlPerLiter: 250,
        sortOrder: 6
    },
    {
        code: "V-603",
        name: "Dioxazine Violet",
        pigment: "PV-23",
        maxMlPerLiter: 200,
        sortOrder: 7
    },
    {
        code: "B-502",
        name: "Phthalo Blue",
        pigment: "PB-15:3",
        maxMlPerLiter: 150,
        sortOrder: 8
    },
    {
        code: "B-560",
        name: "Ultramarine Blue",
        pigment: "PB-29",
        maxMlPerLiter: 250,
        sortOrder: 9
    },
    {
        code: "G-404",
        name: "Phthalo Green",
        pigment: "PG-7",
        maxMlPerLiter: 150,
        sortOrder: 10
    },
    {
        code: "U-115",
        name: "Raw Umber",
        pigment: "PBr-7",
        maxMlPerLiter: 400,
        sortOrder: 11
    },
    {
        code: "S-208",
        name: "Burnt Sienna",
        pigment: "PBr-7c",
        maxMlPerLiter: 400,
        sortOrder: 12
    },
    {
        code: "N-900",
        name: "Carbon Black",
        pigment: "PBk-7",
        maxMlPerLiter: 80,
        sortOrder: 13
    }
];
const BASE_SEED = [
    {
        code: "WB-1",
        name: "White Base",
        description: "For whites and very light tints. Low colourant allowance.",
        maxLoadPct: 8
    },
    {
        code: "PB-2",
        name: "Pastel Base",
        description: "For light-to-mid depth tones. Moderate colourant allowance.",
        maxLoadPct: 20
    },
    {
        code: "DB-3",
        name: "Deep Base",
        description: "For rich, saturated colours. High colourant allowance.",
        maxLoadPct: 45
    },
    {
        code: "CL-4",
        name: "Clear Base",
        description: "For glazes, toners and translucent finishes.",
        maxLoadPct: 60
    }
];
const PRESET_SEED = [
    {
        name: "Gallery White",
        baseCode: "WB-1",
        notes: "Clean gallery white with minimal undertone.",
        isPreset: true,
        items: [
            {
                colorantCode: "W-001",
                mlPerLiter: 30
            },
            {
                colorantCode: "Y-105",
                mlPerLiter: 2
            },
            {
                colorantCode: "R-301",
                mlPerLiter: 1
            }
        ]
    },
    {
        name: "Swiss Fog",
        baseCode: "WB-1",
        notes: "Soft warm fog grey for ceilings and trim.",
        isPreset: true,
        items: [
            {
                colorantCode: "W-001",
                mlPerLiter: 40
            },
            {
                colorantCode: "Y-105",
                mlPerLiter: 4
            },
            {
                colorantCode: "U-115",
                mlPerLiter: 2.5
            },
            {
                colorantCode: "N-900",
                mlPerLiter: 0.8
            }
        ]
    },
    {
        name: "Pale Birch",
        baseCode: "WB-1",
        notes: "Pale birch with a rosy undertone.",
        isPreset: true,
        items: [
            {
                colorantCode: "W-001",
                mlPerLiter: 35
            },
            {
                colorantCode: "Y-105",
                mlPerLiter: 6
            },
            {
                colorantCode: "R-301",
                mlPerLiter: 2.5
            }
        ]
    },
    {
        name: "Harbor Gray",
        baseCode: "PB-2",
        notes: "Cool coastal grey, strong hide.",
        isPreset: true,
        items: [
            {
                colorantCode: "N-900",
                mlPerLiter: 6
            },
            {
                colorantCode: "B-502",
                mlPerLiter: 3
            },
            {
                colorantCode: "U-115",
                mlPerLiter: 4
            }
        ]
    },
    {
        name: "Sage Mist",
        baseCode: "PB-2",
        notes: "Muted green-grey for interior walls.",
        isPreset: true,
        items: [
            {
                colorantCode: "G-404",
                mlPerLiter: 8
            },
            {
                colorantCode: "Y-105",
                mlPerLiter: 10
            },
            {
                colorantCode: "N-900",
                mlPerLiter: 2.5
            },
            {
                colorantCode: "W-001",
                mlPerLiter: 20
            }
        ]
    },
    {
        name: "Storm Cloud",
        baseCode: "PB-2",
        notes: "Mid-depth stormy blue-grey.",
        isPreset: true,
        items: [
            {
                colorantCode: "B-560",
                mlPerLiter: 12
            },
            {
                colorantCode: "N-900",
                mlPerLiter: 8
            },
            {
                colorantCode: "U-115",
                mlPerLiter: 5
            }
        ]
    },
    {
        name: "Desert Taupe",
        baseCode: "PB-2",
        notes: "Warm neutral taupe, pairs with oak and walnut.",
        isPreset: true,
        items: [
            {
                colorantCode: "U-115",
                mlPerLiter: 22
            },
            {
                colorantCode: "Y-105",
                mlPerLiter: 12
            },
            {
                colorantCode: "R-301",
                mlPerLiter: 6
            },
            {
                colorantCode: "N-900",
                mlPerLiter: 2
            }
        ]
    },
    {
        name: "Ochre Field",
        baseCode: "PB-2",
        notes: "Earthy ochre with excellent hide.",
        isPreset: true,
        items: [
            {
                colorantCode: "Y-105",
                mlPerLiter: 45
            },
            {
                colorantCode: "U-115",
                mlPerLiter: 10
            },
            {
                colorantCode: "N-900",
                mlPerLiter: 1.5
            }
        ]
    },
    {
        name: "Slate Blue",
        baseCode: "DB-3",
        notes: "Deep slate with a subtle green cast.",
        isPreset: true,
        items: [
            {
                colorantCode: "B-502",
                mlPerLiter: 60
            },
            {
                colorantCode: "N-900",
                mlPerLiter: 18
            },
            {
                colorantCode: "G-404",
                mlPerLiter: 8
            }
        ]
    },
    {
        name: "Forest Depth",
        baseCode: "DB-3",
        notes: "Dense forest green for feature walls.",
        isPreset: true,
        items: [
            {
                colorantCode: "G-404",
                mlPerLiter: 55
            },
            {
                colorantCode: "Y-105",
                mlPerLiter: 20
            },
            {
                colorantCode: "N-900",
                mlPerLiter: 15
            },
            {
                colorantCode: "B-502",
                mlPerLiter: 10
            }
        ]
    },
    {
        name: "Ember Red",
        baseCode: "DB-3",
        notes: "High-chroma naphthol red. Shake thoroughly.",
        isPreset: true,
        items: [
            {
                colorantCode: "R-450",
                mlPerLiter: 80
            },
            {
                colorantCode: "R-301",
                mlPerLiter: 35
            },
            {
                colorantCode: "Y-210",
                mlPerLiter: 12
            },
            {
                colorantCode: "N-900",
                mlPerLiter: 6
            }
        ]
    },
    {
        name: "Graphite",
        baseCode: "DB-3",
        notes: "Near-black graphite grey for metalwork.",
        isPreset: true,
        items: [
            {
                colorantCode: "N-900",
                mlPerLiter: 90
            },
            {
                colorantCode: "B-502",
                mlPerLiter: 12
            }
        ]
    }
];
let seeded = false;
async function ensureSeed() {
    if (seeded) return;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const colorantCount = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Colorant"].countDocuments();
    if (colorantCount > 0) {
        seeded = true;
        return;
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Colorant"].insertMany(COLORANT_SEED);
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Base"].insertMany(BASE_SEED);
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Formula"].insertMany(PRESET_SEED);
    seeded = true;
}
}),
"[project]/src/lib/sanitize.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Input sanitation for user-supplied text (formula names, notes, search terms).
 *
 * Applied BEFORE values are stored in state and again server-side before
 * persistence. React escapes on render, so this is defence in depth against
 * XSS vectors such as `<script>`, inline event handlers and control chars.
 */ __turbopack_context__.s([
    "sanitizeText",
    ()=>sanitizeText
]);
function sanitizeText(input, maxLength = 120) {
    return input.replace(/[<>]/g, "") // strip characters used to open/close HTML tags
    .replace(/javascript\s*:/gi, "").replace(/on[a-z]+\s*=/gi, "") // strip inline event handler patterns
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // control chars
    .replace(/\s{2,}/g, " ").trim().slice(0, maxLength);
}
}),
"[project]/src/app/api/formulas/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$seed$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/seed.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sanitize.ts [app-route] (ecmascript)");
;
;
;
;
const dynamic = "force-dynamic";
async function GET(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$seed$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureSeed"])();
        const { searchParams } = new URL(request.url);
        const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeText"])(searchParams.get("q") ?? "", 80);
        let filter = {};
        if (query) {
            filter = {
                name: {
                    $regex: query,
                    $options: "i"
                }
            };
        }
        const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Formula"].find(filter).sort({
            isPreset: 1,
            createdAt: -1
        }).limit(100).lean();
        const colorantRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Colorant"].find({}).lean();
        const colorantNameMap = new Map(colorantRows.map((c)=>[
                c.code,
                c.name
            ]));
        const result = rows.map((row)=>{
            const items = (row.items || []).map((item)=>({
                    colorantCode: item.colorantCode,
                    mlPerLiter: item.mlPerLiter,
                    colorantName: colorantNameMap.get(item.colorantCode) ?? item.colorantCode
                }));
            items.sort((a, b)=>b.mlPerLiter - a.mlPerLiter);
            return {
                id: row._id.toString(),
                name: row.name,
                baseCode: row.baseCode,
                notes: row.notes,
                isPreset: row.isPreset,
                createdAt: row.createdAt ? row.createdAt.toISOString() : new Date().toISOString(),
                items
            };
        });
        return Response.json({
            formulas: result
        });
    } catch (error) {
        console.error("[formulas] GET failed", error);
        return Response.json({
            error: "Saved formulas could not be loaded. Check the connection and retry."
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$seed$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureSeed"])();
        let body;
        try {
            body = await request.json();
        } catch  {
            return Response.json({
                error: "Request body is not valid JSON."
            }, {
                status: 400
            });
        }
        const name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeText"])(typeof body.name === "string" ? body.name : "", 60);
        if (name.length < 2) {
            return Response.json({
                error: "Formula name is required (minimum 2 characters).",
                field: "name"
            }, {
                status: 400
            });
        }
        const baseCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeText"])(typeof body.baseCode === "string" ? body.baseCode : "", 16);
        const baseRow = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Base"].findOne({
            code: baseCode
        }).lean();
        if (!baseRow) {
            return Response.json({
                error: "Select a valid base paint.",
                field: "base"
            }, {
                status: 400
            });
        }
        const rawItems = Array.isArray(body.items) ? body.items : [];
        if (rawItems.length === 0 || rawItems.length > 12) {
            return Response.json({
                error: "A formula needs between 1 and 12 colorant rows."
            }, {
                status: 400
            });
        }
        const validColorants = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Colorant"].find({}).lean();
        const known = new Set(validColorants.map((c)=>c.code));
        const seen = new Set();
        const cleanedItems = [];
        for (const item of rawItems){
            const code = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeText"])(typeof item.colorantCode === "string" ? item.colorantCode : "", 16);
            const rate = typeof item.mlPerLiter === "number" ? item.mlPerLiter : Number(item.mlPerLiter);
            if (!known.has(code)) {
                return Response.json({
                    error: `Unknown colorant "${code || "(empty)"}".`
                }, {
                    status: 400
                });
            }
            if (seen.has(code)) {
                return Response.json({
                    error: `Duplicate colorant row for ${code}.`
                }, {
                    status: 400
                });
            }
            if (!Number.isFinite(rate) || rate <= 0 || rate > 600) {
                return Response.json({
                    error: `Rate for ${code} must be between 0 and 600 ml/L.`
                }, {
                    status: 400
                });
            }
            seen.add(code);
            cleanedItems.push({
                colorantCode: code,
                mlPerLiter: Math.round(rate * 100) / 100
            });
        }
        const notes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sanitize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeText"])(typeof body.notes === "string" ? body.notes : "", 240);
        const inserted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Formula"].create({
            name,
            baseCode,
            notes: notes.length > 0 ? notes : null,
            isPreset: false,
            items: cleanedItems
        });
        const colorantNameMap = new Map(validColorants.map((c)=>[
                c.code,
                c.name
            ]));
        return Response.json({
            formula: {
                id: inserted._id.toString(),
                name: inserted.name,
                baseCode: inserted.baseCode,
                notes: inserted.notes,
                isPreset: inserted.isPreset,
                createdAt: inserted.createdAt.toISOString(),
                items: inserted.items.map((i)=>({
                        colorantCode: i.colorantCode,
                        mlPerLiter: i.mlPerLiter,
                        colorantName: colorantNameMap.get(i.colorantCode) ?? i.colorantCode
                    }))
            }
        }, {
            status: 201
        });
    } catch (error) {
        console.error("[formulas] POST failed", error);
        return Response.json({
            error: "The formula could not be saved. Your work is preserved — retry when ready."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0h12wj4._.js.map