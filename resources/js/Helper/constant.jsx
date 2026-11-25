import { GraduationCap, School, Briefcase, Shield, Siren, Store, User } from "lucide-react";

export const educationList = ["SD", "SMP", "SMA", "S1", "S2", "S3"];

export const educationListWithIcon = [
    { value: "SD", label: "SD", icon: <School className="w-6 h-6" /> },
    { value: "SMP", label: "SMP", icon: <School className="w-6 h-6" /> },
    { value: "SMA", label: "SMA", icon: <School className="w-6 h-6" /> },
    { value: "S1", label: "S1", icon: <GraduationCap className="w-6 h-6" /> },
    { value: "S2", label: "S2", icon: <GraduationCap className="w-6 h-6" /> },
    { value: "S3", label: "S3", icon: <GraduationCap className="w-6 h-6" /> },
];

export const jobList = ["PNS", "TNI", "POLRI", "SWASTA", "WIRAUSAHA"];

export const jobListWithIcon = [
    { value: "PNS", label: "PNS", icon: <User className="w-6 h-6" /> },
    { value: "TNI", label: "TNI", icon: <Shield className="w-6 h-6" /> },
    { value: "POLRI", label: "POLRI", icon: <Siren className="w-6 h-6" /> },
    { value: "SWASTA", label: "SWASTA", icon: <Briefcase className="w-6 h-6" /> },
    { value: "WIRAUSAHA", label: "WIRAUSAHA", icon: <Store className="w-6 h-6" /> },
];
export const answerList = [
    [
        {
            name: "Tidak sesuai",
            value: 1,
            questionId: 1,
        },
        {
            name: "Tidak mudah",
            value: 1,
            questionId: 2,
        },
        {
            name: "Tidak cepat",
            value: 1,
            questionId: 3,
        },
        {
            name: "Sangat mahal",
            value: 1,
            questionId: 4,
        },
        {
            name: "Tidak sesuai",
            value: 1,
            questionId: 5,
        },
        {
            name: "Tidak kompeten",
            value: 1,
            questionId: 5,
        },
        {
            name: "Tidak sopan dan ramah",
            value: 1,
            questionId: 7,
        },
        {
            name: "Buruk",
            value: 1,
            questionId: 8,
        },
        {
            name: "Tidak ada",
            value: 1,
            questionId: 9,
        },
    ],
    [
        {
            name: "Kurang sesuai",
            value: 2,
            questionId: 1,
        },
        {
            name: "Kurang mudah",
            value: 2,
            questionId: 2,
        },
        {
            name: "Kurang cepat",
            value: 2,
            questionId: 3,
        },
        {
            name: "Cukup mahal",
            value: 2,
            questionId: 4,
        },
        {
            name: "Kurang sesuai",
            value: 2,
            questionId: 5,
        },
        {
            name: "Kurang kompeten",
            value: 2,
            questionId: 6,
        },
        {
            name: "Kurang sopan dan ramah",
            value: 2,
            questionId: 7,
        },
        {
            name: "Cukup",
            value: 2,
            questionId: 8,
        },
        {
            name: "Ada tetapi tidak berfungsi",
            value: 2,
            questionId: 9,
        },
    ],
    [
        {
            name: "Sesuai",
            value: 3,
            questionId: 1,
        },
        {
            name: "Mudah",
            value: 3,
            questionId: 2,
        },
        {
            name: "Cepat",
            value: 3,
            questionId: 3,
        },
        {
            name: "Murah",
            value: 3,
            questionId: 4,
        },
        {
            name: "Sesuai",
            value: 3,
            questionId: 5,
        },
        {
            name: "Kompeten",
            value: 3,
            questionId: 6,
        },
        {
            name: "Sopan dan ramah",
            value: 3,
            questionId: 7,
        },
        {
            name: "Baik",
            value: 3,
            questionId: 8,
        },
        {
            name: "Berfungsi kurang maksimal",
            value: 3,
            questionId: 9,
        },
    ],
    [
        {
            name: "Sangat sesuai",
            value: 4,
            questionId: 1,
        },
        {
            name: "Sangat mudah",
            value: 4,
            questionId: 2,
        },
        {
            name: "Sangat cepat",
            value: 4,
            questionId: 3,
        },
        {
            name: "Gratis",
            value: 4,
            questionId: 4,
        },
        {
            name: "Sangat sesuai",
            value: 4,
            questionId: 5,
        },
        {
            name: "Sangat kompeten",
            value: 4,
            questionId: 6,
        },
        {
            name: "Sangat sopan dan ramah",
            value: 4,
            questionId: 7,
        },
        {
            name: "Sangat Baik",
            value: 4,
            questionId: 8,
        },
        {
            name: "Dikelola dengan baik",
            value: 4,
            questionId: 9,
        },
    ],
];
