import * as React from "react"
import { cn } from "@/lib/utils"

interface IconProps extends React.DOMAttributes<SVGSVGElement> {
  className?: string
  color?: string
}

const IconPensil = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, color = "#3B82F6", ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("", className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="100" height="100" rx="25" fill={color} />
      <circle cx="50" cy="50" r="30" fill={color} />
      <path
        d="M57.5 35.5L64.5 42.5M39.5 60.5L35.5 64.5M57.5 35.5C59.1569 33.8431 61.8431 33.8431 63.5 35.5C65.1569 37.1569 65.1569 39.8431 63.5 41.5L57.5 35.5ZM57.5 35.5L42.5 50.5M63.5 41.5L48.5 56.5M42.5 50.5L39.5 60.5L48.5 56.5M42.5 50.5L48.5 56.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
)
IconPensil.displayName = "IconPensil"

const IconDokumen = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, color = "#A855F7", ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("", className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="100" height="100" rx="25" fill={color} />
      <circle cx="50" cy="50" r="30" fill={color} />
      <path
        d="M43 38H57M43 46H57M43 54H57M43 62H51M40 33H60V67H40V33Z"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
)
IconDokumen.displayName = "IconDokumen"

const IconDownload = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, color = "#22C55E", ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("", className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="100" height="100" rx="25" fill={color} />
      <circle cx="50" cy="50" r="30" fill={color} />
      <path
        d="M50 38V58M50 58L42 50M50 58L58 50"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 62C42 65 58 65 62 62"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
)
IconDownload.displayName = "IconDownload"

const IconPanduan = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, color = "#F97316", ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("", className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="100" height="100" rx="25" fill={color} />
      <circle cx="50" cy="50" r="30" fill={color} />
      <circle cx="50" cy="50" r="18" stroke="white" strokeWidth="4" />
      <path
        d="M50 40V50M50 56V58"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
)
IconPanduan.displayName = "IconPanduan"

const IconFnQ = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, color = "#F43F5E", ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("", className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="100" height="100" rx="25" fill={color} />
      <circle cx="50" cy="50" r="30" fill={color} />
      <path
        d="M46 44C46 41.7909 47.7909 40 50 40C52.2091 40 54 41.7909 54 44C54 46.2091 52.2091 48 50 48V52M50 58H50.02"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M60 65L55 60L50 63L45 60" fill="none" />
    </svg>
  )
)
IconFnQ.displayName = "IconFnQ"

const IconKontak = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, color = "#0EA5E9", ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("", className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="100" height="100" rx="25" fill={color} />
      <circle cx="50" cy="50" r="30" fill={color} />
      <path
        d="M40 42C40 40.8954 40.8954 40 42 40H45.5C46.134 40 46.7171 40.3995 46.944 40.9942L49.1912 46.883C49.3907 47.405 49.2223 47.9946 48.7831 48.324L46.5 50.0363C47.8284 52.6288 49.3712 54.1716 51.9637 55.5L53.676 53.2169C54.0054 52.7777 54.595 52.6093 55.117 52.8088L61.0058 55.056C61.6005 55.2829 62 55.866 62 56.5V60C62 61.1046 61.1046 62 60 62C48.9543 62 40 53.0457 40 42Z"
        fill="white"
      />
    </svg>
  )
)
IconKontak.displayName = "IconKontak"

interface IconRespondenProps extends React.DOMAttributes<SVGSVGElement> {
  className?: string
  color?: string
}

const IconTotalResponden = React.forwardRef<SVGSVGElement, IconRespondenProps>(
  ({ className, color = "#1E88FF", ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("", className)}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="32" cy="32" r="30" fill="#EAF4FF" />
      <circle cx="26" cy="24" r="8" fill={color} />
      <circle cx="39" cy="26" r="7" fill="#4DA3FF" />
      <path
        d="M14 46C14 38.5 20 34 26 34C32 34 38 38.5 38 46V48H14V46Z"
        fill={color}
      />
      <path
        d="M31 47C31 41.5 35 38 40 38C45 38 49 41.5 49 47V48H31V47Z"
        fill="#4DA3FF"
      />
    </svg>
  )
)
IconTotalResponden.displayName = "IconTotalResponden"

const IconUnsurLayanan = React.forwardRef<SVGSVGElement, IconRespondenProps>(
  ({ className, color = "#B56CFF", ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("", className)}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="32" cy="32" r="30" fill="#F5EBFF" />
      <rect
        x="18"
        y="18"
        width="28"
        height="28"
        rx="6"
        stroke={color}
        strokeWidth="3"
      />
      <circle cx="32" cy="32" r="7" fill={color} />
      <path d="M32 27V37" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M27 32H37" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M41 18L46 13" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
)
IconUnsurLayanan.displayName = "IconUnsurLayanan"

const IconBulanBerjalan = React.forwardRef<SVGSVGElement, IconRespondenProps>(
  ({ className, color = "#1E88FF", ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("", className)}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="32" cy="32" r="30" fill="#EAF4FF" />
      <rect x="16" y="18" width="32" height="30" rx="5" fill={color} />
      <rect x="16" y="18" width="32" height="8" rx="5" fill="#0066FF" />
      <line
        x1="24"
        y1="14"
        x2="24"
        y2="22"
        stroke="#0066FF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="14"
        x2="40"
        y2="22"
        stroke="#0066FF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="22" y="31" width="8" height="6" rx="2" fill="white" />
      <rect x="34" y="31" width="8" height="6" rx="2" fill="#8FC2FF" />
    </svg>
  )
)
IconBulanBerjalan.displayName = "IconBulanBerjalan"

const IconTahun = React.forwardRef<SVGSVGElement, IconRespondenProps>(
  ({ className, color = "#4DA3FF", ...props }, ref) => (
    <svg
      ref={ref}
      className={cn("", className)}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="32" cy="32" r="30" fill="#EAF4FF" />
      <rect x="16" y="18" width="32" height="30" rx="5" fill={color} />
      <rect x="16" y="18" width="32" height="8" rx="5" fill="#0066FF" />
      <line
        x1="24"
        y1="14"
        x2="24"
        y2="22"
        stroke="#0066FF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="14"
        x2="40"
        y2="22"
        stroke="#0066FF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="24" cy="33" r="2.5" fill="white" />
      <circle cx="32" cy="33" r="2.5" fill="white" />
      <circle cx="40" cy="33" r="2.5" fill="white" />
      <circle cx="24" cy="41" r="2.5" fill="#D6EAFF" />
      <circle cx="32" cy="41" r="2.5" fill="#D6EAFF" />
      <circle cx="40" cy="41" r="2.5" fill="#D6EAFF" />
    </svg>
  )
)
IconTahun.displayName = "IconTahun"

interface IconGradientProps extends React.DOMAttributes<SVGSVGElement> {
  className?: string
  color?: string
}

const IconIsiSurvey = React.forwardRef<SVGSVGElement, IconGradientProps>(
  ({ className, color = "#1E88FF", ...props }, ref) => {
    const gradientId = React.useId()
    return (
      <svg
        ref={ref}
        className={cn("", className)}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <rect x="10" y="10" width="44" height="44" rx="10" fill={`url(#${gradientId})`} />
        <path d="M22 42L26 32L38 20L44 26L32 38L22 42Z" fill="white" />
        <path d="M36 18L46 28" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M25 39L28 36" stroke="white" strokeWidth="2" />
      </svg>
    )
  }
)
IconIsiSurvey.displayName = "IconIsiSurvey"

const IconLaporanIkm = React.forwardRef<SVGSVGElement, IconGradientProps>(
  ({ className, color = "#9B5CFF", ...props }, ref) => {
    const gradientId = React.useId()
    return (
      <svg
        ref={ref}
        className={cn("", className)}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path d="M18 12H36L46 22V52H18V12Z" fill={`url(#${gradientId})`} />
        <path d="M36 12V22H46" fill="none" stroke="white" strokeWidth="3" />
        <line x1="24" y1="32" x2="40" y2="32" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <line x1="24" y1="40" x2="40" y2="40" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
)
IconLaporanIkm.displayName = "IconLaporanIkm"

const IconUnduhData = React.forwardRef<SVGSVGElement, IconGradientProps>(
  ({ className, color = "#42D742", ...props }, ref) => {
    const gradientId = React.useId()
    return (
      <svg
        ref={ref}
        className={cn("", className)}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path d="M18 44H46V50H18V44Z" fill={`url(#${gradientId})`} />
        <path d="M32 14V38" stroke={`url(#${gradientId})`} strokeWidth="8" strokeLinecap="round" />
        <path d="M20 30L32 42L44 30" fill="none" stroke={`url(#${gradientId})`} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
)
IconUnduhData.displayName = "IconUnduhData"

const IconPanduan2 = React.forwardRef<SVGSVGElement, IconGradientProps>(
  ({ className, color = "#FFB300", ...props }, ref) => {
    const gradientId = React.useId()
    return (
      <svg
        ref={ref}
        className={cn("", className)}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="22" fill={`url(#${gradientId})`} />
        <path d="M22 28C22 22 27 18 32 18C37 18 42 22 42 28V32H22V28Z" fill="white" />
        <circle cx="28" cy="25" r="3" fill={color} stopOpacity="0.7" />
        <circle cx="36" cy="25" r="3" fill={color} stopOpacity="0.7" />
        <rect x="28" y="36" width="8" height="4" rx="2" fill="white" />
        <circle cx="32" cy="46" r="3" fill="white" />
      </svg>
    )
  }
)
IconPanduan2.displayName = "IconPanduan2"

const IconFaq = React.forwardRef<SVGSVGElement, IconGradientProps>(
  ({ className, color = "#FF5A7A", ...props }, ref) => {
    const gradientId = React.useId()
    return (
      <svg
        ref={ref}
        className={cn("", className)}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path d="M32 10C20 10 12 18 12 30C12 42 20 50 32 50H36L44 56V48C50 44 54 38 54 30C54 18 44 10 32 10Z" fill={`url(#${gradientId})`} />
        <path d="M28 24C28 20 31 18 35 18C39 18 42 20 42 24C42 28 38 29 36 31C34 33 34 34 34 36" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <circle cx="34" cy="44" r="2.5" fill="white" />
      </svg>
    )
  }
)
IconFaq.displayName = "IconFaq"

const IconKontak2 = React.forwardRef<SVGSVGElement, IconGradientProps>(
  ({ className, color = "#18C8FF", ...props }, ref) => {
    const gradientId = React.useId()
    return (
      <svg
        ref={ref}
        className={cn("", className)}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path d="M24 14C18 14 14 18 14 24C14 38 26 50 40 50C46 50 50 46 50 40V36C50 34 48 32 46 32H40C38 32 36 34 36 36V40L30 34C28 32 24 28 24 24V18C24 16 24 14 24 14Z" fill={`url(#${gradientId})`} />
        <path d="M42 16C46 18 48 20 50 24" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <path d="M40 22C42 23 44 25 45 28" stroke={color} strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  }
)
IconKontak2.displayName = "IconKontak2"

export {
  IconPensil,
  IconDokumen,
  IconDownload,
  IconPanduan,
  IconFnQ,
  IconKontak,
  IconTotalResponden,
  IconUnsurLayanan,
  IconBulanBerjalan,
  IconTahun,
  IconIsiSurvey,
  IconLaporanIkm,
  IconUnduhData,
  IconPanduan2,
  IconFaq,
  IconKontak2,
}