## How to write a good bug report: step-by-step instructions

### 一：Isolate bug 
The first step in writing a bug report is to identify exactly what the problem is. 
Saying "something is wrong" is not helpful; saying exactly what is wrong, and how to reproduce it, is. 
If you can tell exactly what is wrong, and reliably reproduce an example of the problem, you've isolated a bug.
    
    提交bug的第一步是准确定位bug的问题所在，只说有问题的话是没用的，要准确描述是什么问题，如何重现。

### 二：Check if you are using the latest version
Bug reports should be based on the the latest version . If you are using a released version or 
an out-of-date build, please update to the latest revision and check to see whether or not the bug still exists.
    
    确保你是使用应用的最新版本，如果是使用之前发布的版本，请升级到最新版再检查该bug是否依然存在。

### 三：Check if the bug is known 
Please check whether the bug you are experiencing is already documented in the issue tracker . If it is already documented, 
you may click "subscribe" to follow any developments. If your bug is different than any others recorded in the issue tracker, "Create a new issue".

    检查是否是已知bug。

### 四：File each issue separately
If you have multiple issues, it is better to file them separately so they can be tracked more easily.
    
    如果你有很多问题，最好把他们分开描述以方便跟踪。
    
### 五：Create a new issue
 
Click on "Create a new issue ".
There are a number of initial questions that are used for filing a bug report - answers to these allow progress.

#### 5.1 Title

The title should describe the problem as best as possible. Remember that the title is read more 
often than any other part of the bug report.

Poor title: Notes don't display correctly
This title is not specific enough for someone to look at it a month from now, and remember what the bug report is referring to.

Good title: Stems too short for 32nd and 64th notes
This title is an improvement over the previous title, because it specifies the type of notes that are affected and identifies the display problem.

After submitting the issue, it is possible to improve the title.

    标题尽可能言简意赅描述好bug, 整个bug report 中标题是被看的最多的部分。
    1. 差标题：音符显示不正确
    2. 好标题：第32个和64个音显示太短

#### 5.2 Issue details

##### 5.2.1. Project

The first question is which project your bug applies to. If in doubt, select "YourAppName", then "Next" to continue.

    描述需要提交bug所在的项目。

##### 5.2.2 Status
The status of new bug reports should generally be marked as "Active".

    每个新提交的bug一般标记为 'active' 状态。

##### 5.2.3 Reported Version
The version of App in which you discovered the bug (e.g., 3.0.2, or 3.0-dev). If you can reproduce the problem in more than one version, select the earliest.    
    
    描述提交bug的项目版本
    
##### 5.2.4 Severity

Severity is the level of impact the bug has on the product.
There is something subjective about severity: when you choosing a level, always think about the product first. 
How much will the bug affect the core purpose of the product?

- S1 **block** 
The bug prevents a user from running/opening app.
    
    
    该bug已经影响了应用的打开/运行。
    
- S2 **Critical** 
The bug prevents the user from doing the intended action. They can’t go further. They're stopped. 
The bug prevents the user from using a key feature of app (e.g. layout, elements positions, mixer), there is no workaround, 
the business logic of a key feature doesn't work. There are security issues, data loss. If app crashes, it's critical.

    
    该bug阻止了用户操作/使用预期的功能，或者应用的关键特性，也就是关键特性的业务逻辑走不通，以及存在安全，数据丢失的问题，如果应用奔溃，都是严重的。
    
- S3 **Major**
The bug is highly disturbing for the user but doesn’t prevent them from doing the action. 
The business logic of a key feature works wrong, but there is a workaround. 
The bug prevents the user from using a non-key feature of the software (e.g. navigator, timeline, piano roll). 
If there is a problem that causes the score to be unusable it is at least major and becomes critical if you can't open the score.

- S4 **Minor**
A bug in the UI which doesn't prevent usage of the features of the application. All other cases.

- S5 **Suggestion**
A suggestion is not a bug, so this means the product works faultlessly and in accordance with the predefined expectations.
However, the reporter perceives it as confusing and/or the reporter thinks it does not conform with the standards, 
or the reporter may be suggesting a new feature for app.

##### 5.2.5 Type
> The type of a bug is the nature of a bug. This categorization is objective: a bug will always have the same nature for whatever product. 
Nevertheless, some bugs are tricky and you may struggle to choose between two categories. 
Type helps us to categorize and prioritize issues.

- Functional
A dynamic bug related to an action you're doing. You can only find it while performing an action on a product. 
The product’s reaction is not as expected.

- Graphical bug(UI)
A static bug related to UI (User Interface) issues.

- Wording bug  
A bug related to the text content, including translation issues

- Ergonomics (UX)
An issue related to various user scenarios and proper placement of the UI elements

- Performance
An issue related to the performance of the software

- Layout bug
Everything related to displaying score, elements.

- Development 
Issues related to the code (although not functional issues - see above), infrastructure, deployment

##### 5.2.6 Frequency
> This category specifies whether the issue has been reported once or this is a frequent topic.

- Once 1 report in the issue tracker or forum
- Few 2-5 reports
- Many More than 5 reports

##### 5.2.7 Reproducibility

> This category defines whether the issue could be reproduced in a particular scenario.

- Always - The steps to reproduce are probably easy to identify and to write. A scenario is always expected.
- Randomly - The issue occurs only sometimes meaning that the conditions to reproduce the bugs are not yet identified, or that the conditions can only be reproduced randomly.
- Once - The bug happened once and even reporter cannot reproduce it again

##### 5.2.8 Regression

> This category specifies whether the issue is a regression or not.

- Yes - The bug cannot be reproduced in the previous version of the software, and/or the bug breaks the logic which works in a previous version.
- No - The bug can be reproduced in the previous version of the software as well.

##### 5.2.9 Workaround

> This category defines whether there is an easy workaround for the issue.

- Yes - There is easy (up to 3 steps) workaround for the reported bug. It means the user can perform the desired action using a different scenario.
- No - There is no workaround to achieve the result.

##### 5.2.10 Priority

> Most bugs will be prioritized. This can only be done core team members. For reference, priorities are defined as follows:

Priority defines the importance of fixing the issue. The issues with high priority should be fixed first.

- P0 - Critical - The issue must be fixed asap. Usually, this priority is used for the issues affecting development/deploy/infrastructure issues.
- P1 - High - The issue should be fixed/implemented in the next release. These issues stop the release.
- P2 - Medium - Nice to have this issue fixed/implemented in the next release. The issue won’t stop the release.
- P3 - Low - The issue can be fixed/implemented, but if someone wants to do so, it is better to spend time on P1/P2 issues if you feel confident enough

### 5.3 Description

#### 5.3.1 Steps to reproduce bug

A bug report requires clear instructions, so that others can consistently reproduce it. 
Many bugs require some experimentation to find the exact steps that cause the problem you are trying to report. 
If you aren't able to discover these, try obtaining some help on the forums instead.

A good set of instructions includes a numbered list that details each button press, 
or menu selection. The following bug reports are good examples to mimic:

Note: the following bugs have all now been fixed

- http://musescore.org/en/node/5870
- http://musescore.org/en/node/6479
- http://musescore.org/en/node/22789

It can also be helpful to test your own instructions, as though someone else is trying them (as they will).


#### 5.3.2 Expected behavior
Describe what should happen if the bug was fixed.

#### 5.3.3 Actual behavior
In contrast to the expected behavior, describe what currently happens when the bug is present.

#### 5.3.4 Version number
In app, go to About (listed in a top menu, depending on your operating system) to find out the 
version of app you are using. For example: "Version: 2.0.0, Revision 6e47f74, Nightly Build".

In the development builds the commit code can be obtained via 'About' and clicking 
the 'Copy to clipboard' button (results in something like 6e47f74, or in 'Help'>'Report a bug'.

Alternately, please state if you have compiled the source code and detail the versions of the third party tools.

#### 5.3.5 Operating system
Name the operating system and version you are using, such as "Windows XP SP3", or "Mac OS X 10.7.5".

### 六：File attachments
If you can supplement your bug report with an MSCZ score, image, audio, or crash log that helps others reproduce the issue, 
attach these files.

### 七：Submit
"Save" to submit your bug report to the issue tracker.

### 八：Following up
Once a developer marks a bug as fixed, it is a good idea to ensure that it is completely fixed. 
To test, download the latest nightly build .
 
### 参考资料

*[1][How to write a good bug report](https://musescore.org/en/handbook/developers-handbook/getting-started/how-write-good-bug-report-step-step-instructions)*







