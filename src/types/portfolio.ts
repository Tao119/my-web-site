// Portfolio Type Definitions

// ============================================================================
// User Profile Types
// ============================================================================

export interface Profile {
    id: string;
    name: string;
    nameEn?: string;
    title: string;
    bio: string;
    email: string;
    location: string;
    avatar: string;
    socialLinks: {
        github?: string;
        linkedin?: string;
        facebook?: string;
        x?: string;
        instagram?: string;
        note?: string;
        qiita?: string;
        zenn?: string;
    };
    experience: {
        company: string;
        position: string;
        startDate: string;
        endDate?: string;
        description: string;
        technologies?: string[];
        order?: number;
    }[];
    education: {
        institution: string;
        degree: string;
        startDate: string;
        endDate?: string;
        description: string;
        subjects?: string[];
        order?: number;
        field?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile {
    id: string;
    name: string;
    nameEn: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    avatar: string;
    socialLinks: SocialLink[];
    education: Education[];
    experience: Experience[];
    createdAt: Date;
    updatedAt: Date;
}

export interface SocialLink {
    platform: string;
    url: string;
    icon: string;
    order?: number;
}

export interface Education {
    id?: string;
    institution: string;
    degree: string;
    field?: string;
    startDate: string | Date;
    endDate?: string | Date;
    description?: string;
    subjects?: string[];
    order?: number;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
    technologies: string[];
    order: number;
}

// ============================================================================
// Skill Types
// ============================================================================

export enum SkillCategory {
    LANGUAGE = "language",
    FRONTEND = "frontend",
    BACKEND = "backend",
    MOBILE = "mobile",
    DATABASE = "database",
    INFRASTRUCTURE = "infrastructure",
    AI = "ai",
    UNITY = "unity",
    DESIGN = "design",
    MANAGEMENT = "management",
}

export interface Skill {
    id: string;
    name: string;
    category: SkillCategory;
    level: number; // 1-100
    years: number;
    icon: string;
    description: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// Project Types
// ============================================================================

export enum ProjectCategory {
    WEB = "web",
    MOBILE = "mobile",
    UNITY = "unity",
    AI = "ai",
    OTHER = "other",
}

export interface Project {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    images: string[];
    technologies: string[];
    category?: ProjectCategory;
    projectUrl?: string;
    githubUrl?: string;
    demoUrl?: string;
    featured: boolean;
    status?: 'completed' | 'in-progress' | 'planned';
    startDate?: Date;
    endDate?: Date;
    order?: number;
    published?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// Blog Types
// ============================================================================

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail: string;
    category: string;
    tags: string[];
    readTime: number;
    published: boolean;
    featured?: boolean;
    externalUrl?: string;
    order?: number;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

// Hero Section
export interface HeroSectionProps {
    title: string;
    subtitle: string;
    catchphrase: string;
    ctaText: string;
    backgroundType: "parallax" | "animated" | "gradient";
}

// Navigation
export interface NavigationProps {
    isScrolled: boolean;
    currentSection: string;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
}

// Profile Section
export interface ProfileSectionProps {
    data: UserProfile;
    showDetailedInfo: boolean;
}

// Skills Section
export interface SkillsSectionProps {
    skills: Skill[];
    animateOnScroll: boolean;
}

// Projects Section
export interface ProjectsSectionProps {
    projects: Project[];
    categories: string[];
}

// Blog Section
export interface BlogSectionProps {
    posts: BlogPost[];
    showCount: number;
}

// Contact Section
export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface ContactSectionProps {
    onSubmit: (data: ContactFormData) => Promise<void>;
}

// ============================================================================
// UI Component Types
// ============================================================================

// Button variants for Neobrutalism design
export type ButtonVariant =
    | "primary"
    | "secondary"
    | "accent"
    | "outline"
    | "ghost";

export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

// Card variants
export type CardVariant = "default" | "accent" | "dark" | "glass";

export interface CardProps {
    variant?: CardVariant;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

// Input types
export interface InputProps {
    type?: "text" | "email" | "password" | "textarea";
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    disabled?: boolean;
    className?: string;
}

// ============================================================================
// Animation Types
// ============================================================================

export interface AnimationConfig {
    duration: number;
    delay?: number;
    easing?: string;
    direction?: "up" | "down" | "left" | "right" | "fade";
}

export interface ScrollAnimationProps {
    children: React.ReactNode;
    animation?: AnimationConfig;
    threshold?: number;
    triggerOnce?: boolean;
}

// ============================================================================
// Layout Types
// ============================================================================

export interface LayoutProps {
    children: React.ReactNode;
    showNavigation?: boolean;
    showFooter?: boolean;
    className?: string;
}

export interface SectionProps {
    id?: string;
    className?: string;
    children: React.ReactNode;
    background?: "default" | "accent" | "dark";
}

// ============================================================================
// Form Types
// ============================================================================

export interface FormFieldProps {
    name: string;
    label?: string;
    type?: "text" | "email" | "password" | "textarea" | "select";
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string; }[];
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        custom?: (value: string) => string | undefined;
    };
}

export interface FormProps {
    fields: FormFieldProps[];
    onSubmit: (data: Record<string, string>) => Promise<void>;
    submitText?: string;
    loading?: boolean;
    className?: string;
}

// ============================================================================
// Admin Types
// ============================================================================

export interface AdminUser {
    id: string;
    username: string;
    email: string;
    role: "admin" | "editor";
    lastLogin: Date;
}

export interface AdminSession {
    user: AdminUser;
    token: string;
    expiresAt: Date;
}

export interface AdminDashboardStats {
    totalProjects: number;
    totalBlogPosts: number;
    totalSkills: number;
    recentActivity: ActivityLog[];
}

export interface ActivityLog {
    id: string;
    action: string;
    resource: string;
    resourceId: string;
    timestamp: Date;
    details?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ============================================================================
// Filter and Search Types
// ============================================================================

export interface FilterOptions {
    categories?: string[];
    technologies?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    featured?: boolean;
    published?: boolean;
}

export interface SearchOptions {
    query?: string;
    filters?: FilterOptions;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
}

// ============================================================================
// Theme Types
// ============================================================================

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeConfig {
    mode: ThemeMode;
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
}

// ============================================================================
// Responsive Types
// ============================================================================

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface ResponsiveValue<T> {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    "2xl"?: T;
}

// ============================================================================
// Utility Types
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// Event Types
// ============================================================================

export interface PortfolioEvent {
    type: string;
    payload?: any;
    timestamp: Date;
}

export type EventHandler<T = any> = (event: PortfolioEvent & { payload: T }) => void;

// ============================================================================
// Configuration Types
// ============================================================================

export interface PortfolioConfig {
    site: {
        title: string;
        description: string;
        url: string;
        author: string;
    };
    features: {
        darkMode: boolean;
        animations: boolean;
        blog: boolean;
        admin: boolean;
    };
    social: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        email?: string;
    };
    analytics?: {
        googleAnalytics?: string;
        plausible?: string;
    };
}