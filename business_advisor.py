import json
from financial_engine import generate_pmegp_schedule


def load_pmegp_scheme():
    with open("pmegp_scheme.json", "r") as file:
        return json.load(file)


def analyze_business(question: str):
    scheme = load_pmegp_scheme()

    question_lower = question.lower()

    if "chicken" in question_lower or "poultry" in question_lower:
        business = "Chicken Farm / Poultry Business"
    elif "dairy" in question_lower or "milk" in question_lower:
        business = "Dairy Business"
    elif "bakery" in question_lower:
        business = "Bakery Business"
    else:
        business = "Small Business"

    project_cost = 500000

    schedule, financial = generate_pmegp_schedule(
        project_cost=project_cost,
        is_rural=True,
        is_special_category=True,
        annual_interest_rate=9.5,
        tenure_years=5,
        moratorium_months=6
    )

    return {
        "business_idea": business,
        "scheme": scheme["scheme_name"],
        "nodal_agency": scheme["nodal_agency"],
        "project_cost": financial["project_cost"],
        "own_contribution": financial["own_contribution"],
        "government_subsidy": financial["govt_subsidy"],
        "bank_loan": financial["bank_loan_amount"],
        "moratorium_months": financial["moratorium_months"],
        "estimated_emi": financial["phase_a_emi"],
        "message": (
            f"For a {business}, PMEGP is a scheme to consider. "
            f"For a sample project cost of ₹{project_cost:,.0f}, "
            f"the estimated own contribution is "
            f"₹{financial['own_contribution']:,.0f}, "
            f"government subsidy is "
            f"₹{financial['govt_subsidy']:,.0f}, "
            f"and bank loan is "
            f"₹{financial['bank_loan_amount']:,.0f}."
        )
    }
