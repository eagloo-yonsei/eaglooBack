import { ObjectUnsubscribedError } from "rxjs";

export function anonymization(postComments: any[]): any[]{
    var result = []
    var commented_users = []
    let user_num : number = 1;

    for (var i=0; i<postComments.length; i++){
        if (commented_users.indexOf(postComments[i].userId)!= -1){
            postComments[i].userName = "익명" + String(commented_users.indexOf(postComments[i].userId) + 1);
        }
        else {
            postComments[i].userName = "익명" + String(user_num);
            commented_users.push(postComments[i].userId);
            user_num++;
        }
        result.push(postComments[i]);
    }
    return result;
}



