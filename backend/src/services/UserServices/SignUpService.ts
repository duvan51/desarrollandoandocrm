import * as Yup from "yup";
import Company from "../../models/Company";
import Plan from "../../models/Plan";
import User from "../../models/User";
import AppError from "../../errors/AppError";

interface Request {
    name: string;
    email: string;
    password?: string;
    companyName: string;
    planId?: number;
}

const SignUpService = async ({
    name,
    email,
    password,
    companyName,
    planId
}: Request): Promise<User> => {
    console.log("SignUpService started:", { name, email, companyName, planId });

    const schema = Yup.object().shape({
        name: Yup.string().required().min(2),
        companyName: Yup.string().required().min(2),
        email: Yup.string()
            .email()
            .required()
            .test(
                "Check-email",
                "An user with this email already exists.",
                async value => {
                    if (!value) return false;
                    try {
                        const emailExists = await User.findOne({
                            where: { email: value }
                        });
                        return !emailExists;
                    } catch (e) {
                        console.error("Error checking email existence:", e);
                        return false;
                    }
                }
            ),
        password: Yup.string().required().min(5)
    });

    try {
        await schema.validate({ email, password, name, companyName });
    } catch (err) {
        console.error("Validation error:", err.message);
        throw new AppError(err.message);
    }

    // Check if a default plan exists if planId is not provided
    let selectedPlanId = planId;
    if (!selectedPlanId) {
        try {
            const defaultPlan = await Plan.findOne({ order: [["name", "ASC"]] });
            if (defaultPlan) {
                selectedPlanId = defaultPlan.id;
            }
        } catch (e) {
            console.error("Error finding default plan:", e);
        }
    }

    console.log("Selected Plan ID:", selectedPlanId);

    try {
        const company = await Company.create({
            name: companyName,
            email,
            password,
            planId: selectedPlanId,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 7)) // 7 days trial
        });
        console.log("Company created:", company.id);

        const user = await User.create({
            name,
            email,
            password,
            profile: "admin",
            companyId: company.id
        });
        console.log("User created:", user.id);

        return user;
    } catch (e) {
        console.error("Error during signup creation:", e);
        throw new AppError("Error creating company or user: " + e.message);
    }
};

export default SignUpService;
