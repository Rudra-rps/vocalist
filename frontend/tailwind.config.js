/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        booth: {
          ink: "#07111f",
          panel: "#0d1b2d",
          line: "#203956",
          cyan: "#26f7ff",
          pink: "#ff4f9e",
          lime: "#c6ff45",
          amber: "#ffe45c",
          red: "#ff5c7a"
        }
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(38,247,255,0.1), 0 0 24px rgba(38,247,255,0.14)",
        pink: "0 0 24px rgba(255,79,158,0.25)"
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulsebar: "pulsebar 1.4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        beacon: "beacon 1.8s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulsebar: {
          "0%, 100%": { transform: "scaleY(0.45)" },
          "50%": { transform: "scaleY(1)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        },
        beacon: {
          "0%, 100%": { opacity: "0.5", transform: "scale(0.96)" },
          "50%": { opacity: "1", transform: "scale(1.02)" }
        }
      }
    }
  },
  plugins: []
};
