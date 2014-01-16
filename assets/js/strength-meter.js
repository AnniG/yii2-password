/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2013
 * @package yii2-password
 * @version 1.0.0
 *
 * Password Strength Meter
 * Modified and built for Yii Framework 2.0
 * Author: Kartik Visweswaran
 * Year: 2013
 * For more Yii related demos visit http://demos.krajee.com
 *
 * Based on password meter created by Jeff Todnem (http://www.todnem.com/)
 */

/**
 * String Reverse
 */
String.prototype.strReverse = function() {
    var newstring = "";
    for (var s = 0; s < this.length; s++) {
        newstring = this.charAt(s) + newstring;
    }
    return newstring;
};
/**
 * Main password check function for strength meter
 */
function checkPwd(pwd, params) {
    var elPwd = params.elPwd, elScorebar = params.elBar, elScore = params.elScore, elVerdict = params.elVerdict, verdicts = params.verdicts
    var oScorebar = $(elScorebar);
    var oScore = $(elScore);
    var oVerdict = $(elVerdict);
    // Simultaneous variable declaration and value assignment aren't supported in IE apparently
    // so I'm forced to assign the same value individually per var to support a crappy browser *sigh* 
    var nScore = 0, nLength = 0, nAlphaUC = 0, nAlphaLC = 0, nNumber = 0, nSymbol = 0, nMidChar = 0, nRequirements = 0, nAlphasOnly = 0, nNumbersOnly = 0, nUnqChar = 0, nRepChar = 0, nRepInc = 0, nConsecAlphaUC = 0, nConsecAlphaLC = 0, nConsecNumber = 0, nConsecSymbol = 0, nConsecCharType = 0, nSeqAlpha = 0, nSeqNumber = 0, nSeqSymbol = 0, nSeqChar = 0, nReqChar = 0, nMultConsecCharType = 0;
    var nMultRepChar = 1, nMultConsecSymbol = 1;
    var nMultMidChar = 2, nMultRequirements = 2, nMultConsecAlphaUC = 2, nMultConsecAlphaLC = 2, nMultConsecNumber = 2;
    var nReqCharType = 3, nMultAlphaUC = 3, nMultAlphaLC = 3, nMultSeqAlpha = 3, nMultSeqNumber = 3, nMultSeqSymbol = 3;
    var nMultLength = 4, nMultNumber = 4;
    var nMultSymbol = 6;
    var nTmpAlphaUC = "", nTmpAlphaLC = "", nTmpNumber = "", nTmpSymbol = "";
    var sAlphaUC = "0", sAlphaLC = "0", sNumber = "0", sSymbol = "0", sMidChar = "0", sRequirements = "0", sAlphasOnly = "0", sNumbersOnly = "0", sRepChar = "0", sConsecAlphaUC = "0", sConsecAlphaLC = "0", sConsecNumber = "0", sSeqAlpha = "0", sSeqNumber = "0", sSeqSymbol = "0";
    var sAlphas = "abcdefghijklmnopqrstuvwxyz";
    var sNumerics = "01234567890";
    var sSymbols = ")!@#$%^&*()";
    var sVerdict = verdicts[0];
    var sStandards = "Below";
    var nMinPwdLen = 8;
    if (document.all) {
        var nd = 0;
    } else {
        var nd = 1;
    }
    if (pwd) {
        nScore = parseInt(pwd.length * nMultLength);
        nLength = pwd.length;
        var arrPwd = pwd.replace(/\s+/g, "").split(/\s*/);
        var arrPwdLen = arrPwd.length;

        /* Loop through password to check for Symbol, Numeric, Lowercase and Uppercase pattern matches */
        for (var a = 0; a < arrPwdLen; a++) {
            str = arrPwd[a]
            if (str.toUpperCase() != str) {
                if (nTmpAlphaUC !== "") {
                    if ((nTmpAlphaUC + 1) == a) {
                        nConsecAlphaUC++;
                        nConsecCharType++;
                    }
                }
                nTmpAlphaUC = a;
                nAlphaUC++;
            }
            else if (str.toLowerCase() != str) {
                if (nTmpAlphaLC !== "") {
                    if ((nTmpAlphaLC + 1) == a) {
                        nConsecAlphaLC++;
                        nConsecCharType++;
                    }
                }
                nTmpAlphaLC = a;
                nAlphaLC++;
            }
            else if (str.match(/[0-9]/g)) {
                if (a > 0 && a < (arrPwdLen - 1)) {
                    nMidChar++;
                }
                if (nTmpNumber !== "") {
                    if ((nTmpNumber + 1) == a) {
                        nConsecNumber++;
                        nConsecCharType++;
                    }
                }
                nTmpNumber = a;
                nNumber++;
            }
            else if (str.match(/[^\w]/g)) {
                if (a > 0 && a < (arrPwdLen - 1)) {
                    nMidChar++;
                }
                if (nTmpSymbol !== "") {
                    if ((nTmpSymbol + 1) == a) {
                        nConsecSymbol++;
                        nConsecCharType++;
                    }
                }
                nTmpSymbol = a;
                nSymbol++;
            }
            /* Internal loop through password to check for repeat characters */
            var bCharExists = false;
            for (var b = 0; b < arrPwdLen; b++) {
                if (arrPwd[a] == arrPwd[b] && a != b) { /* repeat character exists */
                    bCharExists = true;
                    /* 
                     Calculate increment deduction based on proximity to identical characters
                     Deduction is incremented each time a new match is discovered
                     Deduction amount is based on total password length divided by the
                     difference of distance between currently selected match
                     */
                    nRepInc += Math.abs(arrPwdLen / (b - a));
                }
            }
            if (bCharExists) {
                nRepChar++;
                nUnqChar = arrPwdLen - nRepChar;
                nRepInc = (nUnqChar) ? Math.ceil(nRepInc / nUnqChar) : Math.ceil(nRepInc);
            }
        }

        /* Check for sequential alpha string patterns (forward and reverse) */
        for (var s = 0; s < 23; s++) {
            var sFwd = sAlphas.substring(s, parseInt(s + 3));
            var sRev = sFwd.strReverse();
            if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) {
                nSeqAlpha++;
                nSeqChar++;
            }
        }

        /* Check for sequential numeric string patterns (forward and reverse) */
        for (var s = 0; s < 8; s++) {
            var sFwd = sNumerics.substring(s, parseInt(s + 3));
            var sRev = sFwd.strReverse();
            if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) {
                nSeqNumber++;
                nSeqChar++;
            }
        }

        /* Check for sequential symbol string patterns (forward and reverse) */
        for (var s = 0; s < 8; s++) {
            var sFwd = sSymbols.substring(s, parseInt(s + 3));
            var sRev = sFwd.strReverse();
            if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) {
                nSeqSymbol++;
                nSeqChar++;
            }
        }

        /* Modify overall score value based on usage vs requirements */

        /* General point assignment */
        $("nLengthBonus").innerHTML = "+ " + nScore;
        if (nAlphaUC > 0 && nAlphaUC < nLength) {
            nScore = parseInt(nScore + ((nLength - nAlphaUC) * 2));
            sAlphaUC = "+ " + parseInt((nLength - nAlphaUC) * 2);
        }
        if (nAlphaLC > 0 && nAlphaLC < nLength) {
            nScore = parseInt(nScore + ((nLength - nAlphaLC) * 2));
            sAlphaLC = "+ " + parseInt((nLength - nAlphaLC) * 2);
        }
        if (nNumber > 0 && nNumber < nLength) {
            nScore = parseInt(nScore + (nNumber * nMultNumber));
            sNumber = "+ " + parseInt(nNumber * nMultNumber);
        }
        if (nSymbol > 0) {
            nScore = parseInt(nScore + (nSymbol * nMultSymbol));
            sSymbol = "+ " + parseInt(nSymbol * nMultSymbol);
        }
        if (nMidChar > 0) {
            nScore = parseInt(nScore + (nMidChar * nMultMidChar));
            sMidChar = "+ " + parseInt(nMidChar * nMultMidChar);
        }
        $("nAlphaUCBonus").innerHTML = sAlphaUC;
        $("nAlphaLCBonus").innerHTML = sAlphaLC;
        $("nNumberBonus").innerHTML = sNumber;
        $("nSymbolBonus").innerHTML = sSymbol;
        $("nMidCharBonus").innerHTML = sMidChar;

        /* Point deductions for poor practices */
        if ((nAlphaLC > 0 || nAlphaUC > 0) && nSymbol === 0 && nNumber === 0) {  // Only Letters
            nScore = parseInt(nScore - nLength);
            nAlphasOnly = nLength;
            sAlphasOnly = "- " + nLength;
        }
        if (nAlphaLC === 0 && nAlphaUC === 0 && nSymbol === 0 && nNumber > 0) {  // Only Numbers
            nScore = parseInt(nScore - nLength);
            nNumbersOnly = nLength;
            sNumbersOnly = "- " + nLength;
        }
        if (nRepChar > 0) {  // Same character exists more than once
            nScore = parseInt(nScore - nRepInc);
            sRepChar = "- " + nRepInc;
        }
        if (nConsecAlphaUC > 0) {  // Consecutive Uppercase Letters exist
            nScore = parseInt(nScore - (nConsecAlphaUC * nMultConsecAlphaUC));
            sConsecAlphaUC = "- " + parseInt(nConsecAlphaUC * nMultConsecAlphaUC);
        }
        if (nConsecAlphaLC > 0) {  // Consecutive Lowercase Letters exist
            nScore = parseInt(nScore - (nConsecAlphaLC * nMultConsecAlphaLC));
            sConsecAlphaLC = "- " + parseInt(nConsecAlphaLC * nMultConsecAlphaLC);
        }
        if (nConsecNumber > 0) {  // Consecutive Numbers exist
            nScore = parseInt(nScore - (nConsecNumber * nMultConsecNumber));
            sConsecNumber = "- " + parseInt(nConsecNumber * nMultConsecNumber);
        }
        if (nSeqAlpha > 0) {  // Sequential alpha strings exist (3 characters or more)
            nScore = parseInt(nScore - (nSeqAlpha * nMultSeqAlpha));
            sSeqAlpha = "- " + parseInt(nSeqAlpha * nMultSeqAlpha);
        }
        if (nSeqNumber > 0) {  // Sequential numeric strings exist (3 characters or more)
            nScore = parseInt(nScore - (nSeqNumber * nMultSeqNumber));
            sSeqNumber = "- " + parseInt(nSeqNumber * nMultSeqNumber);
        }
        if (nSeqSymbol > 0) {  // Sequential symbol strings exist (3 characters or more)
            nScore = parseInt(nScore - (nSeqSymbol * nMultSeqSymbol));
            sSeqSymbol = "- " + parseInt(nSeqSymbol * nMultSeqSymbol);
        }
        $("nAlphasOnlyBonus").innerHTML = sAlphasOnly;
        $("nNumbersOnlyBonus").innerHTML = sNumbersOnly;
        $("nRepCharBonus").innerHTML = sRepChar;
        $("nConsecAlphaUCBonus").innerHTML = sConsecAlphaUC;
        $("nConsecAlphaLCBonus").innerHTML = sConsecAlphaLC;
        $("nConsecNumberBonus").innerHTML = sConsecNumber;
        $("nSeqAlphaBonus").innerHTML = sSeqAlpha;
        $("nSeqNumberBonus").innerHTML = sSeqNumber;
        $("nSeqSymbolBonus").innerHTML = sSeqSymbol;

        /* Determine Verdict based on overall score */
        if (nScore > 100) {
            nScore = 100;
        } else if (nScore < 0) {
            nScore = 0;
            sVerdict = verdicts[1];
        }
        if (nScore >= 0 && nScore < 20) {
            sVerdict = verdicts[1];
        }
        else if (nScore >= 20 && nScore < 40) {
            sVerdict = verdicts[2];
        }
        else if (nScore >= 40 && nScore < 60) {
            sVerdict = verdicts[3];
        }
        else if (nScore >= 60 && nScore < 80) {
            sVerdict = verdicts[4];
        }
        else if (nScore >= 80 && nScore <= 100) {
            sVerdict = verdicts[5];
        }

        /* Display updated score criteria to client */
        oScorebar.css("background-position", 0 - parseInt(nScore * 4) + "px");
        oScore.html(nScore + "%");
        oVerdict.html(sVerdict);
    }
    else {
        /* Display default score criteria to client */
        initPwdChk(elPwd, elScorebar, elScore, elVerdict, verdicts[0]);
        oScore.html(nScore + "%");
        oVerdict.html(sVerdict);
    }
}
/**
 * Replaces a field type
 */
function replaceField(fld, typ) {
    $(fld).clone(true).attr('type', typ).insertAfter(fld).prev().remove();
}
/**
 * Toggle Password Input Mask
 */
function togPwdMask(pwdField, togField) {
    inputType = ($(togField + ":checked").val()) ? 'text' : 'password';
    replaceField(pwdField, inputType);
}
/**
 * Initialize password check
 */
function initPwdChk(elPwd, elScorebar, elScore, elVerdict, defVerdict) {
    $(elPwd).val("");
    $(elScorebar).css("background-position", "0");
    $(elScore).html("0%");
    $(elVerdict).html(defVerdict);
    replaceField(elPwd, 'password');
}
/**
 * Initialize password meter
 */
function initMeter(params) {
    var elPwd = params.elPwd, elScorebar = params.elBar,
        elScore = params.elScore, elVerdict = params.elVerdict,
        defVerdict = params.verdicts[0]
    $(elPwd).closest('form').bind('reset', function() {
        initPwdChk(elPwd, elScorebar, elScore, elVerdict, defVerdict)
    });
}
