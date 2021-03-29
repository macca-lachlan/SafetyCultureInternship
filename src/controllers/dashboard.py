from flask import Blueprint, request, render_template, redirect, url_for
import requests

dashboard = Blueprint("dashboard", __name__, url_prefix="/")

@dashboard.route("/", methods=["GET"])
def index():
    userToken = request.args.get("api_token")
    auditsURL = "https://sandpit-api.safetyculture.io/audits/search?field=audit_id&owner=me"
    # audits/search?field=audit_id&modified_after=2021-01-01T00:00:00.000Z&modified_before=2021-03-01T00:00:00.000Z&owner=me"
    HTTP_USER_AGENT_ID = 'safetyculture-python-sdk'
    header =  {
                'User-Agent': HTTP_USER_AGENT_ID,
                'Authorization': 'Bearer ' + userToken,
                'sc-integration-id': "safetyculture-sdk-python",
                'sc-integration-version': "4.x",
            }
    response = requests.get(auditsURL, headers=header)
    output = response.json() if response.status_code == requests.codes.ok else None 
    print(output)
    auditIDs = []
    for audit in output['audits']: 
        auditIDs.append(audit['audit_id'])

    auditURL = "https://sandpit-api.safetyculture.io/audits/"
    response = requests.get(auditURL + auditIDs[0], headers=header)
    audit = response.json() if response.status_code == requests.codes.ok else None 
    print("****************AUDIT DATA***********")
    print(audit['audit_data'])
    print("**************AUDIT KEYS*************")
    for key in audit.keys():
        print(key)



    return render_template("dashboard.html", audit_ids=auditIDs)

