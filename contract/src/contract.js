pragma solidity ^ 0.4 .24;

import "./Ownable.sol";

contract ChungChulContract is Ownable {

    bytes32[] public lectureIDs;
    mapping(bytes32 => Lecture) internal lectures;

    uint private start;

    event CreatingLecture(bytes32 indexed id, address indexed teacher, uint lectureCost);
    event Voting(bytes32 indexed lectureID, address indexed voter, uint votes);

    struct Lecture {
        bytes32 id;
        address teacher;
        address[] students;
        bool[] studentRequstRefund;
        uint totalLectureCost;
        uint cost;
        uint voteCount;
        bool exists;
        //MARK: Point Lecture
        uint preparation_point;
        uint content_point;
        uint proceed_point;
        uint interaction_point;
    }

    struct Vote {
        address voter;
        bytes32 lectureID;
    }

    constructor() public {
        owner = msg.sender; //MARK: Admin Wallet Address
    }

    //MARK: Get Total Lecture Count
    function getLectureCount() public view returns(uint lectureCount) {
        return lectureIDs.length;
    }

    //MARK: Get Lecture Vote Point and Vote Count
    function getLectureVote(bytes32 lectureID) public view returns(uint voteCount,
        uint preparation_point,
        uint content_point,
        uint proceed_point,
        uint interaction_point
    ) {
        return (lectures[lectureID].voteCount,
            lectures[lectureID].preparation_point,
            lectures[lectureID].content_point,
            lectures[lectureID].proceed_point,
            lectures[lectureID].interaction_point
        );
    }

    //MARK: Get Lecture byte32 ID (Real ID)
    function getLectureID(uint lectureNumber) public view returns(bytes32 lectureID) {
        return lectureIDs[lectureNumber];
    }

    //MARK: Create Lecture by Teacher
    function lectureCreate(uint lectureCost) public {
        bytes32 id = keccak256(abi.encodePacked(block.number, msg.sender, lectureCost));
        lectureIDs.push(id);

        Lecture storage lecture = lectures[id];
        if (!lecture.exists) {
            lecture.id = id;
            lecture.teacher = msg.sender;
            lecture.cost = lectureCost;
            lecture.exists = true;

            lecture.voteCount = 0;
            lecture.preparation_point = 0;
            lecture.content_point = 0;
            lecture.proceed_point = 0;
            lecture.interaction_point = 0;

            emit CreatingLecture(id, msg.sender, lectureCost);
        }
    }

    //MARK: Vote Lecture by Student
    function voteLecture(
        bytes32 lectureID,
        uint _preparation_point,
        uint _content_point,
        uint _proceed_point,
        uint _interaction_point
    ) public {
        Lecture storage lecture = lectures[lectureID];
        require(lecture.exists);

        lecture.voteCount += 1;
        lecture.preparation_point += _preparation_point;
        lecture.content_point += _content_point;
        lecture.proceed_point += _proceed_point;
        lecture.interaction_point += _interaction_point;

        emit Voting(lectureID, msg.sender, lecture.voteCount);
    }

    //MARK: Calculate Lecture Point for Advantage Lecture Fee
    function calculateLecturePoint(bytes32 lectureID) public view returns(uint totalPoint) {
        Lecture memory lecture = lectures[lectureID];
        totalPoint = 0;
        totalPoint = lecture.preparation_point + lecture.content_point + lecture.proceed_point + lecture.interaction_point;
        totalPoint /= lecture.voteCount;

        return totalPoint;
    }

    //MARK: Get Lecture Total Cost for Lecture ID
    function getLectureTotalCost(bytes32 lectureID) public view returns(uint totalLectureCost) {
        Lecture memory lecture = lectures[lectureID];

        return lecture.totalLectureCost;
    }

    //MARK: Admin Approve Escrow System using Ownable
    function acceptAdmin(uint lectureNumber) external onlyOwner {
        payBalance(lectureNumber);
    }

    //MARK: Divided Lecture Cost with Teacher and Get Lecture Fee
    function payBalance(uint lectureNumber) public payable {
        bytes32 lectureID = getLectureID(lectureNumber);
        Lecture memory lecture = lectures[lectureID];

        //TODO: Write calculateLecturePoint LOGIC HERE!!!

        owner.transfer(lecture.totalLectureCost / 10); //MARK: Lecture Fee

        //MARK: Send to Teacher about Lecture Cost
        // if (lecture.teacher.send(lecture.totalLectureCost)) {
        //     lecture.totalLectureCost = 0;

        // } 
        // else {
        //     revert();
        // }
    }

    //MARK: Purchase Lecture by Student + Must be input Value
    function purchaseLecture(uint lectureNumber) public payable {
        bytes32 lectureID = getLectureID(lectureNumber);
        Lecture storage lecture = lectures[lectureID];
        require(lecture.exists);

        lecture.students.push(msg.sender);
        lecture.studentRequstRefund.push(false);
        lecture.totalLectureCost += msg.value;
    }

    //MARK: Get student index number in lecture students array for Refund
    function getStudentIndexNumber(uint lectureNumber, address _studentAddress) public view returns(uint studentIndex) {
        bytes32 lectureID = getLectureID(lectureNumber);
        Lecture memory lecture = lectures[lectureID];

        for (uint i = 0; i < lecture.students.length; i++) {
            if (_studentAddress == lecture.students[i]) {
                studentIndex = i;
                break;
            }
        }
        return studentIndex;
    }

    // function studentRequstRefund(uint lectureNumber) public {
    //     bytes32 lectureID = getLectureID(lectureNumber);
    //     Lecture storage lecture = lectures[lectureID];
    //     uint studentIndex = getStudentIndexNumber(lectureNumber, msg.sender);
    //     lecture.studentRequstRefund[studentIndex] = true;
    // }

    // //MARK: Refund To Student by Admin
    // function refundToStudent() public {
    //     if (msg.sender == student){
    //         studentOk = false;
    //     } else if (msg.sender == teacher){
    //         teacherOk = false;
    //     }
    //     // if both buyer and seller would like to cancel, money is returned to buyer 
    //     if (!studentOk && !teacherOk){
    //         selfdestruct(student);
    //     }
    // }

    // function kill() public constant {
    //     if (msg.sender == admin) {
    //         selfdestruct(student);
    //     }
    // }

}